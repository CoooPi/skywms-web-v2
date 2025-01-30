import {notFound, redirect} from "next/navigation"
import { getTopLevelLocations } from "./actions"
import { SidebarLayout } from "@/components/SidebarLayout"
import LocationsPage from "./LocationsPage"

// Server component
export default async function Page() {
    let topLevelLocations

    try {
        topLevelLocations = await getTopLevelLocations()
    } catch (err) {
        console.error(err)
        // If we fail to fetch, we can either show unauthorized or notFound
        return notFound()
    }

    // NEW LOGIC:
    // If there is exactly 1 top-level location, redirect directly to that location.
    if (topLevelLocations.length === 1) {
        return redirect(`/locations/${topLevelLocations[0].name}`)
    }

    // If 0 top-level locations, follow existing logic => notFound
    if (topLevelLocations.length === 0) {
        return notFound()
    }

    // The server component delegates UI to the client component
    return (
        <SidebarLayout>
            <LocationsPage data={topLevelLocations} />
        </SidebarLayout>
    )
}