"use client"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { LocationCard } from "@/components/LocationCard"
import { SubLocationTable } from "@/components/SubLocationTable"
import type { Location } from "@/types/LocationTypes"
import { redirect } from "next/navigation"

interface Props {
    location: Location
    chain: { name: string }[]
}

export default function LocationPage({ location, chain }: Props) {
    // placeholders for editing logic
    const handleEdit = (name: string) => {
        console.log(`${name} Edited`)
    }

    const handleDelete = (name: string) => {
        console.log(`${name} Deleted`)
    }

    const handleAdd = () => {
        console.log("Add new sublocation")
    }

    return (
        <div className="container mx-auto p-4 flex flex-col items-center gap-8">
            {/* Breadcrumb section at the top */}
            <div className="w-full max-w-[70%] min-w-[300px]">
                <Breadcrumb>
                    <BreadcrumbList>
                        {chain.map((crumb, idx) => (
                            <BreadcrumbItem key={crumb.name}>
                                {idx < chain.length - 1 ? (
                                    <>
                                        {/* Updated logic here to check if crumb.name is "Locations" */}
                                        <BreadcrumbLink
                                            href={
                                                crumb.name === "Locations"
                                                    ? "/locations"
                                                    : `/locations/${crumb.name}`
                                            }
                                        >
                                            {crumb.name}
                                        </BreadcrumbLink>
                                        <BreadcrumbSeparator />
                                    </>
                                ) : (
                                    <span>{crumb.name}</span>
                                )}
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Main location info */}
            <div className="w-full max-w-[70%] min-w-[300px]">
                <LocationCard location={location} />
            </div>

            {/* Sublocation table */}
            <div className="w-full max-w-[70%] min-w-[300px]">
                <SubLocationTable
                    data={location.subLocations}
                    onSubLocationClick={(name) => redirect(`/locations/${name}`)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={handleAdd}
                />
            </div>
        </div>
    )
}
