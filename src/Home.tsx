import Nullstack from 'nullstack';
import { Input } from './shared/Input';
import type { ApplicationClientContext } from './types/ApplicationClientContext';
import type { ApplicationServerContext } from './types/ApplicationServerContext';
import type { Map, Marker } from 'leaflet';

export class Home extends Nullstack<HomeProps> {
    search = '';
    coords: number[] = [];
    activeEvent: LocalEvent;
    addressResults: AddressResults;
    localEvents: LocalEvent[];
    map: Map;
    markers: Record<number, Marker>;

    static async getAddresses(context: GetSearchQuery) {
        const { bingMaps, query } = context as ApplicationServerContext<GetSearchQuery>;

        const addressResults = await bingMaps.getAddresses(query);

        return {
            resourceSets: addressResults.resourceSets,
        } as AddressResults;
    }

    static async getLocalEvents(context: GetCoords) {
        const { bingMaps, lat, long } = context as ApplicationServerContext<GetCoords>;

        const localEvents: LocalEvent[] = await bingMaps.getLocalEvents(lat, long);

        return localEvents;
    }

    prepare({ project, page }: ApplicationClientContext<HomeProps>) {
        page.title = `${project.name}`;
        page.description = `${project.name} was made with Nullstack`;
    }

    async searchAddress() {
        this.localEvents = undefined;
        this.addressResults = undefined;
        this.addressResults = await Home.getAddresses({ query: this.search });
    }

    async searchLocalEvents() {
        if (this.addressResults) this.addressResults = undefined;
        this.localEvents = await Home.getLocalEvents({ lat: this.coords[0], long: this.coords[1] });

        if (this.localEvents) {
            import('leaflet/dist/leaflet.css');
        }
    }

    async showEventDetails() {
        import('leaflet').then((L) => {
            if (!this.map) {
                const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href=\'https://osm.org/copyright\'>OpenStreetMap</a> contributors',
                });

                this.map = L.map('map', {
                    layers: [osm],
                    maxZoom: 18,
                }).setView([this.coords[0], this.coords[1]], 13);

                const bounds = [];

                const blueIcon = new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                });

                this.localEvents.forEach((localEvent) => {
                    L.marker({
                        lat: localEvent.lat,
                        lng: localEvent.long,
                    }, {
                        icon: blueIcon,
                        opacity: 1,
                    }).addTo(this.map);

                    bounds.push([localEvent.lat, localEvent.long]);
                });

                this.map.fitBounds(bounds, {
                    animate: false,
                    duration: 2,
                });
                this.map.invalidateSize();
            }

            this.map.setView([this.activeEvent.lat, this.activeEvent.long], 18);
        });
    }

    render() {
        return (
            <div class="fixed top-0 left-0 w-full h-full overflow-hidden">
                <section class="container mx-auto flex items-center w-full h-14 py-2 flex-none">
                    <h1 class="block font-crete-round tracking-widest font-bold text-md whitespace-nowrap pr-4">
                        311 Service Lookup
                    </h1>

                    <form onsubmit={() => {}} class="flex w-full">
                        <div class="relative flex-1 pr-2">
                            <Input bind={this.search} oninput={this.searchAddress} debounce={400} spellcheck="false" autofocus placeholder="Postal code"/>

                            {this.addressResults && (
                                <div class="absolute top-full left-0 w-full z-10 flex">
                                    <ul class="w-full bg-white text-neutral-700">
                                        {this.addressResults.resourceSets[0].resources.length
                                            ? this.addressResults.resourceSets[0].resources.map((address) => (
                                                <li class="cursor-pointer" onclick={[{ coords: address.point.coordinates }, this.searchLocalEvents]}>
                                                    {address.name}
                                                </li>
                                            ))
                                            : <li> No results </li>}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </form>
                </section>

                <section class="fixed top-14 left-0 bottom-0 w-80 overflow-hidden dark:bg-neutral-700">
                    {this.localEvents && (
                        <div class="h-full">
                            <ul class="h-full flex flex-col overflow-auto p-1">
                                {this.localEvents.length
                                    ? this.localEvents.map((localEvent) => (
                                        <li class="px-2 py-4 m-1 bg-neutral-800 cursor-pointer" onclick={[{ activeEvent: localEvent }, this.showEventDetails]}>
                                            <ul>
                                                <li> {localEvent.service_name} </li>
                                                <li class="text-neutral-400 text-sm"> {localEvent.address} </li>
                                                <li class="text-neutral-300 text-sm"> {localEvent.requested_datetime} </li>
                                            </ul>
                                        </li>
                                    ))
                                    : <li> No events found, try a different location </li>
                                }
                            </ul>
                        </div>
                    )}
                </section>

                <section class="fixed left-80 right-0 bottom-0 h-80 overflow-hidden dark:bg-neutral-700">
                    {this.activeEvent && (
                        <div class="h-full">
                            <ul class="h-full flex overflow-auto p-1">
                                <li class="basis-1/2 px-2 py-4 m-1 bg-neutral-800">
                                    <ul>
                                        <li class="text-neutral-300 text-sm"> {this.activeEvent.service_name} </li>
                                        <li class="text-neutral-400 text-sm"> {this.activeEvent.address} </li>
                                        <li class="text-neutral-400 text-sm"> {this.activeEvent.requested_datetime} </li>
                                        <li class="text-md pt-2"> {this.activeEvent.description} </li>
                                    </ul>
                                </li>
                                <div class={'basis-1/2 p-1'}>
                                    <img class={this.activeEvent.media_url ? 'object-contain h-full' : 'invisible'} src={this.activeEvent.media_url} alt={this.activeEvent.service_name} loading="lazy" />
                                </div>
                            </ul>
                        </div>
                    )}
                </section>

                <section class="fixed top-14 left-80 right-0 bottom-80 w-full overflow-hidden dark:bg-neutral-700">
                    <div id="map" class="w-full h-full"></div>
                </section>
            </div>
        );
    }
}
