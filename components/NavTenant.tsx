"use client"

import * as React from "react"
import Image from "next/image"

interface NavTenantProps {
    tenants: {
        name: string
        logo: string
    }[]
}

export function NavTenant({ tenants }: NavTenantProps) {
    const [activeTenant, setActiveTenant] = React.useState<{
        name: string
        logo: string
    } | null>(null)

    React.useEffect(() => {
        if (!tenants || tenants.length === 0) {
            setActiveTenant(null)
            return
        }

        // Attempt to parse subdomain from the hostname
        const host = typeof window !== "undefined" ? window.location.hostname : ""
        const possibleSubdomain = host.split(".")[0]
        const foundTenant = tenants.find((t) => t.name === possibleSubdomain)

        if (foundTenant) {
            setActiveTenant(foundTenant)
        } else {
            // fallback to the first tenant if subdomain is unrecognized
            setActiveTenant(tenants[0])
        }
    }, [tenants])

    if (!activeTenant) {
        return null
    }

    return (
        <div className="flex items-center justify-center">
            <Image
                src={activeTenant.logo || "/fallback-logo.png"}
                alt={activeTenant.name}
                width={160}
                height={80}
                className="max-h-16 w-auto"
            />
        </div>
    )
}
