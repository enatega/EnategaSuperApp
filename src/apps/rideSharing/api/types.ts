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
    pickup: Location;
    dropoff: Location;
    vehicleType?: VehicleType;
    paymentMethod?: string;
}

export interface UpdateRidePayload {
    rideId: string;
    status?: RideStatus;
    rating?: number;
    feedback?: string;
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
