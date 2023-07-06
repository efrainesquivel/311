// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HomeProps {}

interface AddressResults {
    resourceSets: [{
        resources: [{
            name: string;
            address: {
                adminDistrict: string;
                locality: string;
                postalCode: string;
            };
            point: {
                coordinates: number[];
            };
        }];
        estimatedTotal: number;
    }]
}

interface GetSearchQuery {
    query: string
}

interface GetCoords {
    lat: number;
    long: number;
}

interface LocalEvent {
    description: string;
    address: string;
    lat: number;
    long: number;
    service_request_id: number;
    service_name: string;
    requested_datetime: string;
    media_url: string;
}

declare module '*.css';
