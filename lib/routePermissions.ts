//Config deciding what permissions can access what pages.
export const routePermissions = {
    "/dashboard": "ROLE_ADMIN",
    "/locations": "ROLE_ADMIN",
    // Add more routes and their required permissions
} as const

export type Permission = (typeof routePermissions)[keyof typeof routePermissions]

export function hasPermission(userPermissions: string[], requiredPermission: Permission): boolean {
    return userPermissions.includes(requiredPermission)
}

