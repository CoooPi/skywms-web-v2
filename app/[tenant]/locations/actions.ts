"use server"

import { cookies } from "next/headers"
import { headers } from "next/headers"
import {Location, SubLocation} from "@/types/LocationTypes"

/**
 * Fetch the top-level locations from the backend.
 * Now returns an array of SubLocation objects.
 */
export async function getTopLevelLocations() {
    const cookieStore = await cookies();
    const header = await headers();
    const token = cookieStore.get("token")?.value;
    if (!token) {
        throw new Error("Not authenticated");
    }

    const activeTenant = header.get("x-active-tenant") || "";

    const res = await fetch(`${process.env.BACKEND_API_URL}/locations/top-level`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-TenantID": activeTenant,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch top-level locations");
    }

    const data: SubLocation[] = await res.json();
    return data;
}

/**
 * Fetch a location by name from the backend.
 * @param name - the location name
 */
export async function getLocationByName(name: string) {
    const cookieStore = await cookies();
    const header = await headers();
    const token = cookieStore.get("token")?.value
    if (!token) {
        throw new Error("Not authenticated")
    }

    // Read the active tenant from the incoming request headers
    const activeTenant = header.get("x-active-tenant") || ""

    const res = await fetch(`${process.env.BACKEND_API_URL}/locations/${encodeURIComponent(name)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            // Use the activeTenant from subdomain
            "X-TenantID": activeTenant,
        },
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch location: ${name}`)
    }

    return res.json()
}

/**
 * Recursively fetch the location's chain (all parents) up to the top-level.
 * Returns both the final location data and a chain array for breadcrumbs.
 */
export async function getLocationChain(name: string): Promise<{
    location: Location
    chain: { name: string }[]
}> {
    const chain: { name: string }[] = []

    let currentName: string | null = name

    // Keep fetching the parent location until no parent is found
    while (currentName) {
        const loc: Location = await getLocationByName(currentName)
        chain.unshift({ name: loc.name })

        if (!loc.parentLocationName) {
            break
        }

        currentName = loc.parentLocationName
    }

    // Fetch the actual requested location
    const requestedLocation = await getLocationByName(name)

    return {
        location: requestedLocation,
        chain,
    }
}