import React, { memo, useEffect, useMemo, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { LatLng, Region } from "react-native-maps";
import Icon from "../../../../../../general/components/Icon";
import Map, { MapMarker } from "../../../../../../general/components/Map";
import { useTheme } from "../../../../../../general/theme/theme";
import MapStoreBottomSheet from "./MapStoreBottomSheet";
import MapStoreMarker from "./MapStoreMarker";
import SeeAllMapLoadingState from "./SeeAllMapLoadingState";
import type { SeeAllMapStore } from "./mapStoreUtils";

const DEFAULT_REGION: Region = {
  latitude: 24.8607,
  longitude: 67.0011,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const FOCUSED_DELTA = {
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

type Props = {
  stores: SeeAllMapStore[];
  userCoordinate: LatLng;
  selectedStoreId: string | null;
  isLoading: boolean;
  loadingTitle: string;
  loadingDescription: string;
  bottomSheetTitle: string;
  ctaLabel: string;
  onBackPress: () => void;
  onListPress: () => void;
  onSelectStore: (storeId: string) => void;
  onCloseSheet: () => void;
  onViewStore: () => void;
};

function getRegionFromCoordinates(coordinate: LatLng): Region {
  return {
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    ...FOCUSED_DELTA,
  };
}

function SeeAllMapView({
  stores,
  userCoordinate,
  selectedStoreId,
  isLoading,
  loadingTitle,
  loadingDescription,
  bottomSheetTitle,
  ctaLabel,
  onBackPress,
  onListPress,
  onSelectStore,
  onCloseSheet,
  onViewStore,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView | null>(null);

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
        onPress: () => onSelectStore(store.id),
        tracksViewChanges: true,
        render: (
          <MapStoreMarker
            title={store.title}
            isSelected={store.id === selectedStoreId}
          />
        ),
      })),
    [onSelectStore, selectedStoreId, storesWithCoordinates],
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

    mapRef.current.animateToRegion(getRegionFromCoordinates(userCoordinate), 350);
  }, [selectedStore, storesWithCoordinates, userCoordinate]);

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
          onPress={onBackPress}
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
          <Icon type="Ionicons" name="arrow-back" size={20} color={colors.text} />
        </Pressable>

        {/* Todo: can implement the right button in future */}
        {/* <Pressable
          accessibilityRole="button"
          onPress={onListPress}
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
          <Icon type="Feather" name="list" size={20} color={colors.text} />
        </Pressable> */}
      </View>

      {isLoading ? (
        <SeeAllMapLoadingState
          title={loadingTitle}
          description={loadingDescription}
        />
      ) : null}

      <MapStoreBottomSheet
        store={selectedStore}
        onClose={onCloseSheet}
        onViewStore={onViewStore}
        title={bottomSheetTitle}
        ctaLabel={ctaLabel}
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
