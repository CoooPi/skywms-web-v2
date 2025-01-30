// File: /Users/theo/Documents/WebstormProjects/skywms-shad/app/[tenant]/locations/[locationName]/page.tsx

import { getLocationChain, getTopLevelLocations } from "../actions";
import { SidebarLayout } from "@/components/SidebarLayout";
import LocationPage from "./LocationPage";

interface Props {
    params: Promise<{ locationName: string }>;
}

export default async function Page(props: Props) {
    const { params } = props;
    const { locationName } = await params;

    // Fetch the location chain
    const { location, chain } = await getLocationChain(locationName);

    // Also fetch top-level locations to decide if we prepend "Locations" in the breadcrumb
    const topLevelLocations = await getTopLevelLocations();

    // By default, the final chain is the returned chain for that location
    let finalChain = [...chain];

    // Only prepend "Locations" if there are more than one top-level location
    if (topLevelLocations.length > 1) {
        finalChain = [{ name: "Locations" }, ...finalChain];
    }

    return (
        <SidebarLayout>
            <LocationPage location={location} chain={finalChain} />
        </SidebarLayout>
    );
}
