// File: /Users/theo/Documents/WebstormProjects/skywms-shad/app/[tenant]/locations/LocationsPage.tsx
"use client"

import { useTransition } from "react"
import { redirect } from "next/navigation"
import { SubLocationTable } from "@/components/SubLocationTable"

interface Props {
    data: {
        name: string
        volume: number | null
        pathIndex: number | null
        locationTypeNames: string[]
    }[]
}

export default function LocationsPage({ data }: Props) {
    const [isPending, startTransition] = useTransition()

    const handleClickSubLocation = (name: string) => {
        startTransition(() => {
            redirect(`/locations/${name}`)
        })
    }

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
            <div className="w-full max-w-[70%] min-w-[300px]">
                <h1 className="text-xl font-semibold mb-4">Locations</h1>
                <SubLocationTable
                    data={data}
                    onSubLocationClick={handleClickSubLocation}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={handleAdd}
                />
            </div>
        </div>
    )
}
