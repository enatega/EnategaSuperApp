// ─── Shared Types for Driver Profile ─────────────────────────────────────────

export type RatingBreakdown = { star: number; count: number };

export type Review = {
    reviewerId: string;
    reviewerName: string;
    reviewerProfile: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export type DriverProfileData = {
    type: string;
    riderId: string;
    joiningTime: string;
    vehicle: {
        vehicleName: string;
        vehicleNo: string;
        vehicleColor: string;
    };
    profile: {
        name: string;
        userId: string;
        profilePic: string;
    };
    totalRides: number;
    averageRating: string;
    totalReviews: number;
    ratingBreakdown: RatingBreakdown[];
    reviews: Review[];
};
