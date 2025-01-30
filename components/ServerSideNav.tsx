import { getUserData } from "@/lib/userData"
import {hasPermission, Permission} from "@/lib/routePermissions"
import {getTenantConfig} from "@/lib/tenantConfig";

export interface NavItem {
    title: string
    url: string
    permission: string
}

export interface NavGroup {
    title: string
    items: NavItem[]
}

// Our static data for the nav
const data: NavGroup[] = [
    {
        title: "Dashboards",
        items: [
            { title: "Overview", url: "/dashboard", permission: "ROLE_ADMIN" },
            { title: "Analytics", url: "/", permission: "ROLE_ADMIN" },
        ],
    },
    {
        title: "Delivery",
        items: [
            { title: "Orders", url: "/", permission: "ROLE_ADMIN" },
            { title: "Routes", url: "/", permission: "ROLE_ADMIN" },
        ],
    },
    {
        title: "Warehouse",
        items: [
            { title: "Inventory", url: "/", permission: "ROLE_ADMIN" },
            { title: "Locations", url: "/locations", permission: "ROLE_ADMIN" },
        ],
    },
]

export async function getServerSideNav(): Promise<{
    navGroups: NavGroup[]
    tenantEntries: { name: string; logo: string}[]
}> {
    const { permissions, tenants } = await getUserData();

    // Filter nav groups by the user's permissions
    const navGroups = data
        .map((group) => ({
            ...group,
            items: group.items.filter((item) =>
                hasPermission(permissions, item.permission as Permission)
            ),
        }))
        .filter((group) => group.items.length > 0)

    // Build an array of tenant objects with their config
    const tenantEntries = tenants.map((tenantName: string) => {
        const config = getTenantConfig(tenantName)
        return {
            name: tenantName,
            logo: config.logoPath,
        }
    })

    console.log("NavGroups:", navGroups, "TenantEntries:", tenantEntries);
    return { navGroups, tenantEntries }
}