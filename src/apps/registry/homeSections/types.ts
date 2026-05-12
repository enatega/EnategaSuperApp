import type { MiniAppId } from '../generated/appI18nRegistry';
import type { MiniAppRouteParamsById } from '../generated/appRegistry';

export type SelectMiniAppFn = (
  id: MiniAppId,
  params?: MiniAppRouteParamsById[MiniAppId],
) => void;
