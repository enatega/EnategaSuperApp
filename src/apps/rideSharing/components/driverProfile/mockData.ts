import type { DriverProfileData } from './types';

// ─── Static Mock Data (replace with API response later) ───────────────────────

export const DRIVER_DATA: DriverProfileData = {
    type: 'rider',
    riderId: 'd6709455-b5ad-430b-85dc-2f7d8581b512',
    joiningTime: '2025-10-30T09:37:40.015Z',
    vehicle: {
        vehicleName: 'Honda Civic Nahoor Edition',
        vehicleNo: 'AWE 121',
        vehicleColor: 'Black',
    },
    profile: {
        name: 'Nahoor Paji',
        userId: '89501c4c-e522-470a-9dcf-3bf24137ec77',
        profilePic:
            'https://enatega-backend.s3.eu-north-1.amazonaws.com/4187a317-f060-4b11-ba72-775177f0519f-img_1059.heic',
    },
    totalRides: 121,
    averageRating: '4.20',
    totalReviews: 20,
    ratingBreakdown: [
        { star: 5, count: 10 },
        { star: 4, count: 6 },
        { star: 3, count: 3 },
        { star: 2, count: 0 },
        { star: 1, count: 1 },
    ],
    reviews: [
        {
            reviewerId: 'f6ad0c2d-337e-4e41-8ad9-ef2d9bf89f3d',
            reviewerName: 'Inshirah Nasir',
            reviewerProfile:
                'https://enatega-backend.s3.eu-north-1.amazonaws.com/c524d71c-447e-4ed8-a964-d9f63925e023-img_1134.png',
            rating: 5,
            comment: 'Great person to work with!',
            createdAt: '2025-11-26T11:22:44.249Z',
        },
        {
            reviewerId: 'f6ad0c2d-337e-4e41-8ad9-ef2d9bf89f3d',
            reviewerName: 'Inshirah Nasir',
            reviewerProfile:
                'https://enatega-backend.s3.eu-north-1.amazonaws.com/c524d71c-447e-4ed8-a964-d9f63925e023-img_1134.png',
            rating: 5,
            comment: 'Cool',
            createdAt: '2025-11-26T11:23:42.737Z',
        },
        {
            reviewerId: 'f6ad0c2d-337e-4e41-8ad9-ef2d9bf89f3d',
            reviewerName: 'Inshirah Nasir',
            reviewerProfile:
                'https://enatega-backend.s3.eu-north-1.amazonaws.com/c524d71c-447e-4ed8-a964-d9f63925e023-img_1134.png',
            rating: 5,
            comment: 'Cool',
            createdAt: '2025-12-10T18:16:49.510Z',
        },
        {
            reviewerId: '4fa1efd7-f002-4994-984c-95ecf637d8ae',
            reviewerName: 'Ifrah Fasihh',
            reviewerProfile:
                'https://lumistorageacc.blob.core.windows.net/lumi-ride-container/b200687a-d9ba-430d-a73a-d7444025a4c5-img_0697.png',
            rating: 1,
            comment: '',
            createdAt: '2025-12-11T04:15:45.223Z',
        },
        {
            reviewerId: '7f05858f-83b5-4033-a525-2740489936e4',
            reviewerName: 'Ifrah fasihh',
            reviewerProfile:
                'https://enatega-backend.s3.eu-north-1.amazonaws.com/6f018c47-9863-4dfb-8c87-b2a67adec5fc-9fa9ed3e-634a-43d5-aa7b-81fd3f07bc43.jpg',
            rating: 4,
            comment: '',
            createdAt: '2025-12-24T06:51:13.850Z',
        },
    ],
};
