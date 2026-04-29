// ---------------------------------------------------------------------------
// Shared API types
// ---------------------------------------------------------------------------

/** Standard paginated response wrapper returned by all list endpoints. */
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/** Standard single-resource response wrapper. */
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

// ---------------------------------------------------------------------------
// Ride
// ---------------------------------------------------------------------------

export type RideStatus =
    | 'pending'
    | 'accepted'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

export interface Location {
    latitude: number;
    longitude: number;
    address: string;
}

export interface Ride {
    id: string;
    pickup: Location;
    dropoff: Location;
    status: RideStatus;
    fare: number;
    currency: string;
    distance: number;  // km
    duration: number;  // minutes (estimated)
    createdAt: string;
    updatedAt: string;
}

export interface RideDetails extends Ride {
    driver?: Driver;
    vehicle?: Vehicle;
    route?: Location[];
    paymentMethod?: string;
    rating?: number;
}

// ---------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------

export interface Driver {
    id: string;
    name: string;
    phone: string;
    photo?: string;
    rating: number;
    totalRides: number;
}

// ---------------------------------------------------------------------------
// Vehicle
// ---------------------------------------------------------------------------

export type VehicleType = 'sedan' | 'suv' | 'mini' | 'premium' | 'bike';

export interface Vehicle {
    id: string;
    type: VehicleType;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
}

// ---------------------------------------------------------------------------
// Request / mutation payloads
// ---------------------------------------------------------------------------

export interface CreateRidePayload {
    pickup: { lat: number; lng: number };
    dropoff: { lat: number; lng: number };
    ride_type_id: string;
    fare?: number;
    payment_via: string;
    is_hourly: boolean;
    stops?: Array<{
        lat: number;
        lng: number;
        address: string;
        order: number;
    }>;
    pickup_address: string;
    pickup_location: string;
    dropoff_location: string;
    destination_address: string;
    is_scheduled: boolean;
    is_family: boolean;
    estimated_time?: number;
    estimated_distance?: number;
    base_fair?: number;
    offered_fair?: number;
    scheduled_at?: string;
    courier_delivery_mode?: 'TO_BUILDING' | 'TO_DOOR';
    sender_phone_number?: string;
    receiver_phone_number?: string;
    comments_for_courier?: string;
    package_size?: number;
    package_size_category?: 'S' | 'M' | 'L';
    package_types?: string[];
    pickup_street_building?: string;
    pickup_address_details?: string;
    destination_street_building?: string;
    destination_address_details?: string;
    pickup_coordinates?: { lat: number; lng: number };
    destination_coordinates?: { lat: number; lng: number };
}

export interface ActiveRideRequestRideType {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    seatCount?: number;
    isActive?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ActiveRideRequestPayload {
    id: string;
    passenger_id?: string;
    pickup: { lat: number; lng: number };
    dropoff: { lat: number; lng: number };
    pickup_location: string;
    dropoff_location: string;
    payment_via: string;
    ride_type_id: string;
    courier_detail_id?: string | null;
    offeredFair?: string | number | null;
    baseFair?: string | number | null;
    status: string;
    expiresAt?: string;
    is_hourly: boolean;
    is_family: boolean;
    is_scheduled: boolean;
    scheduled_at?: string | null;
    estimated_time?: string | number | null;
    estimated_distance?: string | number | null;
    createdAt?: string;
    zone_id?: string;
    passenger?: unknown;
    ride_type?: ActiveRideRequestRideType | null;
    stops?: ActiveRideStop[];
    zone?: unknown;
}

export interface ActiveRideRequestResponse {
    success: boolean;
    message: string;
    activeRideRequest: ActiveRideRequestPayload | null;
}

export interface RideBidPayload {
    id: string;
    ride_request_id: string;
    rider_id: string;
    riderSId: string;
    price: number;
    status: string;
    createdAt?: string;
    expiresAt?: string;
    remainingTimeMs?: number;
}

export interface ActiveRideUserLocation {
    lat?: number | string | null;
    lng?: number | string | null;
    heading?: number | string | null;
    speed?: number | string | null;
    timestamp?: number | string | null;
}

export interface ActiveRideUser {
    id: string;
    name: string;
    profile?: string | null;
    phone?: string | null;
    createdAt?: string;
    current_location?: ActiveRideUserLocation | null;
}

export interface ActiveRideDriverDynamicInfo {
    averageRating?: number | string | null;
    noOfRatings?: number | string | null;
    riderTotalRides?: number | string | null;
}

export interface ActiveRideVehicle {
    name?: string | null;
    colour?: string | null;
    no?: string | null;
}

export interface ActiveRideDriver {
    id: string;
    license_valid?: boolean;
    photcontrol_complete?: boolean;
    dynamic_info?: ActiveRideDriverDynamicInfo | null;
    user?: ActiveRideUser | null;
    vehicle?: ActiveRideVehicle | null;
}

export interface ActiveRideStop {
    id?: string | null;
    order?: number | string | null;
    ride_request_id?: string | null;
    address?: string | null;
    lat?: number | string | null;
    lng?: number | string | null;
    coordinates?: {
        type?: string | null;
        coordinates?: [number, number] | number[] | null;
    } | null;
}

export interface ActiveRideLocationPoint {
    lat: number | string;
    lng: number | string;
}

export interface ActiveRideRideType {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    seatCount?: number | null;
}

export interface ActiveRidePayload {
    ride_id: string;
    pickup: ActiveRideLocationPoint;
    pickup_location: string;
    dropoff: ActiveRideLocationPoint;
    dropoff_location: string;
    agreed_price?: number | string | null;
    ride_status: string;
    driver_reached_at?: string | null;
    in_progress_at?: string | null;
    waiting_window_sec?: number | null;
    payment_via: string;
    isScheduled?: boolean;
    scheduledAt?: string | null;
    stops: ActiveRideStop[];
    ride_type?: ActiveRideRideType | null;
    driver?: ActiveRideDriver | null;
    courierDetail?: unknown;
}

export interface RaiseRideFarePayload {
    rideRequestId: string;
    newFare: number;
}

export interface RaiseRideFareResponse {
    success?: boolean;
    message?: string;
    rideReq?: ActiveRideRequestPayload | null;
}

export interface AcceptRideBidPayload {
    customerId: string;
    bidId: string;
    isSchedule: boolean;
    payment_via: string;
    scheduledAt?: string;
}

export interface AcceptRideBidParams {
    rideBidId: string;
    payload: AcceptRideBidPayload;
}

export interface RejectRideBidParams {
    rideBidId: string;
}

export interface UpdateRidePayload {
    rideId: string;
    status?: RideStatus;
    rating?: number;
    feedback?: string;
}

export interface SubmitRideReviewPayload {
    description: string;
    rating: number;
    reviewedId?: string;
    rideId: string;
    reviewerId: string;
}

export interface RideEstimatePayload {
    pickup: Location;
    dropoff: Location;
}

export interface RideEstimate {
    vehicleType: VehicleType;
    fare: number;
    currency: string;
    duration: number;  // minutes
    distance: number;  // km
}

// ---------------------------------------------------------------------------
// Ride Types / Fares
// ---------------------------------------------------------------------------

export type RideTypeFare = {
    ride_type_id?: string;
    name: string;
    imageUrl?: string | null;
    capacity?: number;
    fare?: number;
    recommendedFare?: number;
};

export type RideFareResponse = {
    rideTypeFares: RideTypeFare[];
    [key: string]: unknown;
};

export type RideTypeFareParams = {
    distanceKm: number;
    durationMin: number;
    isHourly: boolean;
    pickup_lat?: number;
    pickup_lng?: number;
    dropoff_lat?: number;
    dropoff_lng?: number;
};

export type RideTypeCatalogItem = {
    id: string;
    name: string;
    imageUrl: string | null;
    description: string;
    seatCount: number;
    isActive: boolean;
    created_at: string;
    updated_at: string;
};

export type RidePlacePrediction = {
    description: string;
    place_id: string;
};

export type RidePlaceCoordinates = {
    lat: string;
    lng: string;
};

export type RideAddressSelection = {
    placeId: string;
    description: string;
    structuredFormatting: {
        mainText: string;
        secondaryText?: string;
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
};

export type NearbyDriver = {
    id: string;
    latitude: number;
    longitude: number;
    heading?: number;
    name?: string;
    vehicleType?: string;
};

export type DistanceMatrixResponse = {
    distanceKm: number;
    durationMin: number;
};

// ---------------------------------------------------------------------------
// Filters
// ---------------------------------------------------------------------------

export interface RideFilters {
    status?: RideStatus;
    page?: number;
    limit?: number;
}

// ---------------------------------------------------------------------------
// Driver / Rider Profile Stats  (/api/v1/rides/get-stats/:userId)
// ---------------------------------------------------------------------------

export interface DriverVehicle {
    vehicleName: string | null;
    vehicleNo: string | null;
    vehicleColor: string | null;
}

export interface DriverProfileInfo {
    name: string;
    userId: string;
    profilePic: string;
}

// ---------------------------------------------------------------------------
// Customer Rides (list endpoint: /api/v1/rides/customers)
// ---------------------------------------------------------------------------

export interface CustomerRideListItem {
    rideId: string;
    rideStatus: string; // 'COMPLETED' | 'CANCELLED' | 'ASSIGNED' | 'SCHEDULED' | 'IN_PROGRESS'
    riderId: string;
    createdAt: string;
    scheduledAt: string | null;
    agreedPrice: number;
    rideType: {
        id: string;
        name: string;
        imageUrl: string;
        seatCount: number;
    };
}

export interface CustomerRidesResponse {
    data: CustomerRideListItem[];
    offset: number;
    limit: number;
}

// ---------------------------------------------------------------------------
// Customer Ride Detail (detail endpoint: /api/v1/rides/{rideId}/details/customer)
// ---------------------------------------------------------------------------

export interface CustomerRideDetail {
    rideId: string;
    rideStatus: string;
    rideType: {
        id: string;
        name: string;
        imageUrl: string;
        seatCount: number;
    };
    riderInfo?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        profile: string;
        totalCompletedRides: number;
        averageRating: number;
        vehicle: {
            vehicle_name: string;
            vehicle_colour: string;
            vehicle_no: string;
        };
    };
    agreedPrice: number;
    scheduledAt: string | null;
    isScheduled: boolean;
    paymentVia: string;
    pickup: {
        lat: number;
        lng: number;
        location: string;
    };
    dropoff: {
        lat: number;
        lng: number;
        location: string;
    };
    stops?: ActiveRideStop[];
}

export interface DriverRatingBreakdown {
    star: number;
    count: number;
}

export interface DriverReview {
    reviewerId: string;
    reviewerName: string;
    reviewerProfile: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface DriverProfileStats {
    type: string;
    riderId: string;
    joiningTime: string;
    vehicle: DriverVehicle;
    profile: DriverProfileInfo;
    totalRides: number;
    averageRating: string;
    totalReviews: number;
    ratingBreakdown: DriverRatingBreakdown[];
    reviews: DriverReview[];
}

// ---------------------------------------------------------------------------
// Rider Vehicle Info (/api/v1/ride-vehicles/rider/:riderId/vehicle-info)
// ---------------------------------------------------------------------------

export interface RiderVehicleInfo {
    vehicleName: string | null;
    vehicleNo: string | null;
    vehicleColor: string | null;
}

// ---------------------------------------------------------------------------
// User  (/api/v1/users)
// ---------------------------------------------------------------------------

export interface UserApiData {
    id: string;
    email: string | null;
    phone: string | null;
    password: string | null;
    name: string;
    email_is_verified: boolean;
    phone_is_verified: boolean;
    fcm_token: string | null;
    profile: string | null;
    active_status: boolean;
    block_status: boolean;
    google_id: string | null;
    current_location: string | null;
    last_login: string | null;
    tokenVersion: number;
    role_id: string | null;
    two_factor_enabled: boolean;
    internal_notes: string;
    must_change_pass: boolean;
    termsAccepted: boolean;
    soft_delete: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserApiResponse {
    user: UserApiData;
}
