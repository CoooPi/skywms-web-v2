import {ReactNode} from "react"
import {headers} from "next/headers"
import {TenantThemeDataProvider} from "@/context/TenantThemeDataProvider"

interface TenantLayoutProps {
    children: ReactNode
    params: Promise<{ tenant: string }>
}

export default async function TenantLayout(props: TenantLayoutProps) {
    const { children, params } = props
    const { tenant } = await params
    const h = await headers()
    const maybeHeader = h.get("x-active-tenant") || ""
    const tenantValue = maybeHeader !== "" ? maybeHeader : tenant

    return (
        <TenantThemeDataProvider tenant={tenantValue}>
            {children}
        </TenantThemeDataProvider>
    )
}
