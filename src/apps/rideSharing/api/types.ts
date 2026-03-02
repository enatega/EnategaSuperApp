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
