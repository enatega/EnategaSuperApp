import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { LatLng, Region } from "react-native-maps";
import Icon from "../../../../../../general/components/Icon";
import Map, { MapMarker } from "../../../../../../general/components/Map";
import { useTheme } from "../../../../../../general/theme/theme";
import type { MultiVendorStackParamList } from "../../../navigation/types";
import MapStoreBottomSheet from "./MapStoreBottomSheet";
import MapStoreMarker from "./MapStoreMarker";
import {
  SEE_ALL_DEFAULT_USER_COORDINATE,
  toSeeAllMapStore,
  type SeeAllMapStore,
} from "./mapStoreUtils";
import SeeAllMapLoadingState from "./SeeAllMapLoadingState";

const DEFAULT_REGION: Region = {
  latitude: 24.8607,
  longitude: 67.0011,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const FOCUSED_DELTA = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function getRegionFromCoordinates(coordinate: LatLng): Region {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    ...FOCUSED_DELTA,
  };
}

function SeeAllMapView() {
  const { t } = useTranslation("deliveries");
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const route =
    useRoute<RouteProp<MultiVendorStackParamList, "SeeAllMapView">>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);
  const hasInitializedSelectionRef = useRef(false);
  const { items, title } = route.params;
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const stores = useMemo<SeeAllMapStore[]>(
    () => items.map((item, index) => toSeeAllMapStore(item, index)),
    [items],
  );
  const isLoading = items.length === 0;
  const userCoordinate = SEE_ALL_DEFAULT_USER_COORDINATE;

  const storesWithCoordinates = useMemo(
    () => stores.filter((store) => Boolean(store.coordinate)),
    [stores],
  );
  const selectedStore =
    stores.find((store) => store.id === selectedStoreId) ?? null;
  const initialCoordinate = userCoordinate;

  const markers = useMemo<MapMarker[]>(
    () =>
      storesWithCoordinates.map((store) => ({
        id: store.id,
        coordinate: store.coordinate!,
        active: true,
        zIndex: store.id === selectedStoreId ? 3 : 1,
        keyOverride: `${store.id}-${store.id === selectedStoreId ? "selected" : "default"}`,
        onPress: () => setSelectedStoreId(store.id),
        tracksViewChanges: true,
        render: (
          <MapStoreMarker
            title={store.title}
            isSelected={store.id === selectedStoreId}
          />
        ),
      })),
    [selectedStoreId, storesWithCoordinates],
  );

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    if (selectedStore?.coordinate) {
      mapRef.current.animateToRegion(
        getRegionFromCoordinates(selectedStore.coordinate),
        350,
      );
      return;
    }

    const coordinates = storesWithCoordinates
      .map((store) => store.coordinate)
      .filter(Boolean) as LatLng[];

    if (coordinates.length === 1) {
      mapRef.current.animateToRegion(
        getRegionFromCoordinates(coordinates[0]),
        350,
      );
      return;
    }

    if (coordinates.length > 1) {
      mapRef.current.fitToCoordinates(coordinates, {
        animated: true,
        edgePadding: {
          top: 180,
          right: 48,
          bottom: 260,
          left: 48,
        },
      });
      return;
    }

    mapRef.current.animateToRegion(
      getRegionFromCoordinates(userCoordinate),
      350,
    );
  }, [selectedStore, storesWithCoordinates, userCoordinate]);

  useEffect(() => {
    if (!hasInitializedSelectionRef.current) {
      hasInitializedSelectionRef.current = true;
      setSelectedStoreId(storesWithCoordinates[0]?.id ?? null);
      return;
    }

    if (!selectedStoreId) {
      return;
    }

    if (storesWithCoordinates.some((store) => store.id === selectedStoreId)) {
      return;
    }

    setSelectedStoreId(null);
  }, [selectedStoreId, storesWithCoordinates]);

  return (
    <View style={styles.container}>
      <Map
        ref={mapRef}
        initialRegion={
          initialCoordinate
            ? getRegionFromCoordinates(initialCoordinate)
            : DEFAULT_REGION
        }
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        markers={markers}
        useGoogleProvider
      />

      <View style={[styles.header, { top: insets.top + 8 }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.headerButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadowColor,
              opacity: pressed ? 0.82 : 1,
            },
          ]}
        >
          <Icon
            type="Ionicons"
            name="arrow-back"
            size={20}
            color={colors.text}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <SeeAllMapLoadingState
          title={t("see_all_map_loading_title", { title })}
          description={t("see_all_map_loading_description")}
        />
      ) : null}

      <MapStoreBottomSheet
        store={selectedStore}
        onClose={() => setSelectedStoreId(null)}
        onViewStore={() => navigation.goBack()}
        title={t("see_all_map_sheet_title")}
        ctaLabel={t("see_all_map_cta")}
      />
    </View>
  );
}

export default memo(SeeAllMapView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    left: 16,
    position: "absolute",
    right: 16,
  },
  headerButton: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    elevation: 3,
    height: 40,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    width: 40,
  },
});
