import { useQuery } from "@tanstack/react-query";
import type { LatLng } from "react-native-maps";
import type { ApiError } from "../../../general/api/apiClient";
import { addressService } from "../../../general/api/addressService";
import { deliveryKeys } from "../api/queryKeys";

type Coordinate = LatLng | null | undefined;

function toRouteKeyValue(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "unknown";
  }

  return value.toFixed(4);
}

export function useDeliveryRoutePath(
  origin: Coordinate,
  destination: Coordinate,
  options?: {
    enabled?: boolean;
    staleTime?: number;
  },
) {
  const isEnabled =
    Boolean(options?.enabled ?? true)
    && Boolean(origin)
    && Boolean(destination);

  return useQuery<Array<{ latitude: number; longitude: number }>, ApiError>({
    queryKey: deliveryKeys.route(
      `origin:${toRouteKeyValue(origin?.latitude)}:${toRouteKeyValue(origin?.longitude)}`,
      `destination:${toRouteKeyValue(destination?.latitude)}:${toRouteKeyValue(destination?.longitude)}`,
    ),
    enabled: isEnabled,
    staleTime: options?.staleTime ?? 15 * 1000,
    queryFn: () =>
      addressService.getRoutePath(
        {
          lat: origin!.latitude,
          lng: origin!.longitude,
        },
        {
          lat: destination!.latitude,
          lng: destination!.longitude,
        },
      ),
  });
}
