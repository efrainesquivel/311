import context from '../../server';

class BingMapsService {
    static bindStaticFunctions() {}

    async getAddresses(query: string) {
        const { secrets } = context;
        const response = await fetch(`https://dev.virtualearth.net/REST/v1/Locations/${query}?o=json&key=${secrets.bingKey}`);

        return response.json();
    }

    async getLocalEvents(lat: number, long: number) {
        const response = await fetch(`https://seeclickfix.com/open311/v2/requests.json?lat=${lat}&long=${long}`);

        return response.json();
    }
}

export const bingMaps = new BingMapsService();
