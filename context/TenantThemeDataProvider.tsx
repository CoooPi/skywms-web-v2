"use client"

import * as React from "react"
import setTenantTheme from "@/lib/themes"

interface TenantThemeDataProviderProps {
    // changed from TenantThemes to string
    tenant: string
    children: React.ReactNode
}

export function TenantThemeDataProvider({
                                            tenant,
                                            children,
                                        }: TenantThemeDataProviderProps) {
    // We use a mounted check so that we don’t render the page until after
    // setting the theme color. This helps avoid flicker on first paint.
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(() => {
        // Call our new theme setter
        setTenantTheme(tenant)

        if (!isMounted) {
            setIsMounted(true)
        }
    }, [tenant, isMounted])

    // Hide children until the color is set
    if (!isMounted) {
        return null
    }

    return <>{children}</>
}
