const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPS_DIR = path.join(ROOT, 'src', 'apps');
const MANIFEST_FILE = path.join(ROOT, 'src', 'apps', 'registry', 'app-manifest.json');
const OUT_FILE = path.join(ROOT, 'src', 'apps', 'registry', 'generated', 'appRegistry.ts');
const I18N_OUT_FILE = path.join(ROOT, 'src', 'apps', 'registry', 'generated', 'appI18nRegistry.ts');

const IGNORED = new Set(['registry']);

const APP_ROUTE_META = {
  deliveries: {
    routeName: 'Deliveries',
    navigatorImport: '../../deliveries/navigation/DeliveriesNavigator',
    paramsTypeImport: "import type { DeliveriesStackParamList } from '../../deliveries/navigation/types';",
    paramsType: 'NavigatorScreenParams<DeliveriesStackParamList> | undefined',
  },
  rideSharing: {
    routeName: 'RideSharing',
    navigatorImport: '../../rideSharing/navigation/RideSharingNavigator',
    paramsTypeImport:
      "import type { RideSharingStackParamList } from '../../rideSharing/navigation/RideSharingNavigator';",
    paramsType: 'NavigatorScreenParams<RideSharingStackParamList> | undefined',
  },
  appointments: {
    routeName: 'Appointments',
    navigatorImport: '../../appointments/navigation/AppointmentsNavigator',
    paramsType: 'undefined',
  },
  developerMode: {
    routeName: 'DeveloperMode',
    navigatorImport: '../../developerMode/navigation/DeveloperModeNavigator',
    paramsType: 'undefined',
  },
  homeVisits: {
    routeName: 'HomeVisits',
    navigatorImport: '../../homeVisits/navigation/HomeVisitsNavigator',
    paramsType: 'undefined',
  },
};

const toSortedAppIds = () => {
  const entries = fs.readdirSync(APPS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !IGNORED.has(name))
    .sort((a, b) => a.localeCompare(b));
};

const hasFile = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));

const readManifest = () => {
  if (!fs.existsSync(MANIFEST_FILE)) {
    return { enabledApps: [] };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
    const enabledApps = Array.isArray(parsed.enabledApps)
      ? parsed.enabledApps.filter((value) => typeof value === 'string')
      : [];
    return { enabledApps };
  } catch (error) {
    console.warn(`Unable to parse ${path.relative(ROOT, MANIFEST_FILE)}. Falling back to all discovered apps.`, error);
    return { enabledApps: [] };
  }
};

const build = () => {
  const discoveredAppIds = toSortedAppIds();
  const manifest = readManifest();
  const enabledSet = new Set(manifest.enabledApps);

  const appIds = enabledSet.size
    ? discoveredAppIds.filter((appId) => enabledSet.has(appId))
    : discoveredAppIds;

  const appIdsLiteral = appIds.map((id) => `'${id}'`).join(', ');

  const navigatorApps = appIds.filter((id) => {
    const meta = APP_ROUTE_META[id];
    return meta && hasFile(`src/apps/${id}/navigation/${path.basename(meta.navigatorImport)}.tsx`);
  });

  const localizationApps = appIds.filter(
    (id) => hasFile(`src/apps/${id}/localization/en.ts`) && hasFile(`src/apps/${id}/localization/fr.ts`),
  );

  const navigatorImports = navigatorApps
    .map((id) => {
      const meta = APP_ROUTE_META[id];
      return `import ${meta.routeName}Navigator from '${meta.navigatorImport}';`;
    })
    .join('\n');

  const routeNames = navigatorApps.map((id) => APP_ROUTE_META[id].routeName);
  const routeUnion = routeNames.length ? routeNames.map((name) => `'${name}'`).join(' | ') : 'never';

  const paramsTypeImports = navigatorApps
    .map((id) => APP_ROUTE_META[id].paramsTypeImport)
    .filter(Boolean)
    .join('\n');

  const localizationsImports = localizationApps
    .map((id) => {
      const alias = id.charAt(0).toUpperCase() + id.slice(1);
      return `import ${alias}En from '../../${id}/localization/en';\nimport ${alias}Fr from '../../${id}/localization/fr';`;
    })
    .join('\n');

  const hasRideOptionsSection = appIds.includes('rideSharing') && hasFile('src/apps/rideSharing/components/RideOptionsSection.tsx');
  const hasDeliveryServicesSection =
    appIds.includes('rideSharing') &&
    appIds.includes('deliveries') &&
    hasFile('src/apps/rideSharing/components/DeliveryServicesSection.tsx');
  const hasRecommendedStoresSection = appIds.includes('deliveries') && hasFile(
    'src/apps/deliveries/components/home/DeliveriesRecommendedStoresSection.tsx',
  );

  const homeWidgetImports = [
    hasRideOptionsSection
      ? "import RideOptionsSection from '../../rideSharing/components/RideOptionsSection';"
      : '',
    hasDeliveryServicesSection
      ? "import DeliveryServicesSection from '../../rideSharing/components/DeliveryServicesSection';"
      : '',
    hasRecommendedStoresSection
      ? "import DeliveriesRecommendedStoresSection from '../../deliveries/components/home/DeliveriesRecommendedStoresSection';"
      : '',
  ]
    .filter(Boolean)
    .join('\n');

  const routeEntries = navigatorApps
    .map((id) => {
      const meta = APP_ROUTE_META[id];
      return `  ${id}: '${meta.routeName}',`;
    })
    .join('\n');

  const paramsEntries = appIds
    .map((id) => {
      const meta = APP_ROUTE_META[id];
      const paramsType = meta?.paramsType ?? 'undefined';
      return `  ${id}: ${paramsType};`;
    })
    .join('\n');

  const sharedStackEntries = routeNames
    .map((routeName) => {
      const appId = navigatorApps.find((id) => APP_ROUTE_META[id].routeName === routeName);
      return appId ? `  ${routeName}: MiniAppRouteParamsById['${appId}'];` : '';
    })
    .filter(Boolean)
    .join('\n');

  const screenEntries = navigatorApps
    .map((id) => {
      const meta = APP_ROUTE_META[id];
      return `  ${meta.routeName}: ${meta.routeName}Navigator,`;
    })
    .join('\n');

  const i18nEnEntries = localizationApps
    .map((id) => {
      const alias = id.charAt(0).toUpperCase() + id.slice(1);
      return `    ${id}: ${alias}En,`;
    })
    .join('\n');

  const i18nFrEntries = localizationApps
    .map((id) => {
      const alias = id.charAt(0).toUpperCase() + id.slice(1);
      return `    ${id}: ${alias}Fr,`;
    })
    .join('\n');

  const homeWidgetEntries = [
    hasRideOptionsSection ? '  rideOptions: RideOptionsSection,' : '',
    hasDeliveryServicesSection ? '  deliveryServices: DeliveryServicesSection,' : '',
    hasRecommendedStoresSection ? '  recommendedStores: DeliveriesRecommendedStoresSection,' : '',
  ]
    .filter(Boolean)
    .join('\n');

  const i18nContent = `/* eslint-disable */\n// Auto-generated by scripts/generate-app-registry.cjs\n// Do not edit manually.\n\n${localizationsImports}\n\nexport const MINI_APPS = [${appIdsLiteral}] as const;\nexport type MiniAppId = (typeof MINI_APPS)[number];\n\nexport const APP_I18N_RESOURCES = {\n  en: {\n${i18nEnEntries}\n  },\n  fr: {\n${i18nFrEntries}\n  },\n} as const;\n\nexport const APP_I18N_NAMESPACES = Object.keys(APP_I18N_RESOURCES.en) as MiniAppId[];\n`;

  const registryContent = `/* eslint-disable */\n// Auto-generated by scripts/generate-app-registry.cjs\n// Do not edit manually.\n\nimport type { ComponentType } from 'react';\nimport type { NavigatorScreenParams } from '@react-navigation/native';\nimport type { MiniAppId } from './appI18nRegistry';\n${paramsTypeImports}\n${navigatorImports}\n${homeWidgetImports}\n\nexport type SharedAppRouteName = ${routeUnion};\n\nexport type MiniAppRouteParamsById = {\n${paramsEntries}\n};\n\nexport type SharedStackAppRoutes = {\n${sharedStackEntries}\n};\n\nexport const APP_ROUTE_BY_ID: Partial<Record<MiniAppId, SharedAppRouteName>> = {\n${routeEntries}\n};\n\nexport const APP_SCREENS: Partial<Record<SharedAppRouteName, ComponentType>> = {\n${screenEntries}\n};\n\nexport type RideIntent = 'now' | 'schedule' | 'rental' | 'courier';\n\nexport type HomeWidgets = {\n  rideOptions?: ComponentType<{ onSelectRideOption?: (rideIntent: RideIntent) => void }>;\n  deliveryServices?: ComponentType<{ onSelectService?: (shopTypeId: string) => void }>;\n  recommendedStores?: ComponentType<{\n    onSelectMiniApp?: (id: MiniAppId, params?: MiniAppRouteParamsById[MiniAppId]) => void;\n  }>;\n};\n\nexport const HOME_WIDGETS: HomeWidgets = {\n${homeWidgetEntries}\n};\n`;

  fs.writeFileSync(I18N_OUT_FILE, i18nContent, 'utf8');
  fs.writeFileSync(OUT_FILE, registryContent, 'utf8');
  console.log(
    `Generated ${path.relative(ROOT, I18N_OUT_FILE)} and ${path.relative(ROOT, OUT_FILE)} for apps: ${appIds.join(', ') || '(none)'} (discovered: ${discoveredAppIds.join(', ') || '(none)'})`,
  );
};

build();
