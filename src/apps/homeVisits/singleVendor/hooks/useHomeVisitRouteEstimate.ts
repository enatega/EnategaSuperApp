import React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { LatLng } from 'react-native-maps';
import { addressService } from '../../../../general/api/addressService';

type Point = LatLng | null | undefined;

type Params = {
  origin: Point;
  destination: Point;
  preferredRoutePath?: LatLng[] | null;
  preferredDistanceKm?: number | null;
  preferredEstimatedMinutes?: number | null;
};

function roundCoord(value: number) {
  return Number(value.toFixed(5));
}

function isValidPoint(point: Point): point is LatLng {
  return Boolean(
    point &&
      Number.isFinite(point.latitude) &&
      Number.isFinite(point.longitude),
  );
}

export default function useHomeVisitRouteEstimate({
  origin,
  destination,
  preferredRoutePath,
  preferredDistanceKm,
  preferredEstimatedMinutes,
}: Params) {
  const [hasResolvedFallback, setHasResolvedFallback] = React.useState(false);
  const hasOrigin = isValidPoint(origin);
  const hasDestination = isValidPoint(destination);
  const hasPreferredRoute = Array.isArray(preferredRoutePath) && preferredRoutePath.length > 1;
  const hasPreferredDistance = typeof preferredDistanceKm === 'number';
  const hasPreferredEta = typeof preferredEstimatedMinutes === 'number';

  const shouldQuery =
    hasOrigin &&
    hasDestination &&
    !hasResolvedFallback &&
    (!hasPreferredRoute || !hasPreferredDistance || !hasPreferredEta);

  const query = useQuery({
    queryKey: [
      'homeVisitsRouteEstimate',
      hasOrigin ? roundCoord(origin.latitude) : null,
      hasOrigin ? roundCoord(origin.longitude) : null,
      hasDestination ? roundCoord(destination.latitude) : null,
      hasDestination ? roundCoord(destination.longitude) : null,
    ],
    enabled: shouldQuery,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    queryFn: async () => {
      if (!hasOrigin || !hasDestination) {
        return {
          distanceKm: null,
          estimatedMinutes: null,
          routePath: null,
        };
      }

      const [routePath, matrix] = await Promise.all([
        addressService.getRoutePath(
          { lat: origin.latitude, lng: origin.longitude },
          { lat: destination.latitude, lng: destination.longitude },
        ),
        addressService.getDistanceMatrix(
          { lat: origin.latitude, lng: origin.longitude },
          { lat: destination.latitude, lng: destination.longitude },
        ),
      ]);

      return {
        distanceKm: matrix.distanceKm,
        estimatedMinutes: matrix.durationMin,
        routePath,
      };
    },
  });

  React.useEffect(() => {
    if (query.data) {
      setHasResolvedFallback(true);
    }
  }, [query.data]);

  return {
    distanceKm:
      preferredDistanceKm ??
      query.data?.distanceKm ??
      null,
    estimatedMinutes:
      preferredEstimatedMinutes ??
      query.data?.estimatedMinutes ??
      null,
    routePath:
      hasPreferredRoute
        ? preferredRoutePath
        : query.data?.routePath ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
