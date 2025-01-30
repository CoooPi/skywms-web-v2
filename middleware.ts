// File: /Users/theo/Documents/WebstormProjects/skywms-shad/middleware.ts

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { routePermissions } from "@/lib/routePermissions"
import { TENANT_CONFIG } from "@/lib/tenantConfig"

/**
 * Return the path with the subdomain prefix removed if present,
 * so we can match e.g. “/dashboard” in routePermissions.
 */
function getBarePathname(pathname: string, subdomain: string) {
    // If the path is /subdomain/... => remove that part from the front
    if (pathname.startsWith(`/${subdomain}/`)) {
        return pathname.slice(subdomain.length + 1)
    }
    // If the path is exactly /subdomain => becomes "/"
    if (pathname === `/${subdomain}`) {
        return "/"
    }
    return pathname
}

/**
 * Check if there’s a required permission for the “bare” path.
 */
function getRequiredPermission(barePath: string) {
    return (routePermissions as Record<string, string>)[barePath]
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1) Early skip logic for certain paths:
    //    - /_next, /api, /unauthorized, /favicon.ico
    //    - anything that ends in .png, .jpg, .jpeg, .webp, .ico, .svg
    const lowerPath = pathname.toLowerCase()
    if (
        lowerPath.startsWith("/_next") ||
        lowerPath.startsWith("/api") ||
        lowerPath.startsWith("/unauthorized") ||
        lowerPath === "/favicon.ico" ||
        /\.(?:png|jpg|jpeg|webp|ico|svg)$/.test(lowerPath)
    ) {
        // Skip these routes entirely
        return NextResponse.next()
    }

    // Then everything else continues
    const token = request.cookies.get("token")?.value

    // Figure out subdomain from host
    const host = request.headers.get("host") || ""
    const hostWithoutPort = host.split(":")[0] // remove e.g. :3000
    const [maybeSubdomain] = hostWithoutPort.split(".") // first part
    const isRecognizedSubdomain =
        maybeSubdomain !== "localhost" &&
        maybeSubdomain !== "www" &&
        !maybeSubdomain.endsWith("myrootdomain") &&
        !!TENANT_CONFIG[maybeSubdomain]

    // If NO token => let the user reach the correct login page
    if (!token) {
        if (isRecognizedSubdomain) {
            // The subdomain-based login path is "/{subdomain}/login"
            const subdomainLoginPath = `/${maybeSubdomain}/login`
            // If we’re not already at /{subdomain}/login, rewrite to it
            if (pathname !== subdomainLoginPath) {
                // Create new URL with subdomain-based login path
                const newUrl = request.nextUrl.clone()
                newUrl.pathname = subdomainLoginPath

                // Copy cookies & other headers to ensure SSR can read them if needed
                const updatedHeaders = new Headers(request.headers)
                const originalCookie = request.headers.get("cookie")
                if (originalCookie) {
                    updatedHeaders.set("cookie", originalCookie)
                }

                return NextResponse.rewrite(newUrl, {
                    request: {
                        headers: updatedHeaders,
                    },
                })
            }
            // Already at /{subdomain}/login => just allow
            return NextResponse.next()
        } else {
            // If subdomain is not recognized => root domain => /login
            if (pathname !== "/login") {
                const rootLogin = request.nextUrl.clone()
                rootLogin.pathname = "/login"

                const updatedHeaders = new Headers(request.headers)
                const originalCookie = request.headers.get("cookie")
                if (originalCookie) {
                    updatedHeaders.set("cookie", originalCookie)
                }

                return NextResponse.rewrite(rootLogin, {
                    request: {
                        headers: updatedHeaders,
                    },
                })
            }
            // Already at /login => allow
            return NextResponse.next()
        }
    }

    // If we do have a token => fetch user data to confirm membership & perms
    let userData
    try {
        const resp = await fetch(`${process.env.BACKEND_API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (!resp.ok) {
            throw new Error("Token validation failed")
        }
        userData = await resp.json()
    } catch (err) {
        console.error(err)
        // If invalid token => remove it & go to root login
        const resp = NextResponse.redirect(new URL("/login", request.url))
        resp.cookies.delete("token")
        return resp
    }

    // Extract user info
    const { username, permissions, tenants } = userData
    const extractedPermissions = permissions.map((p: { authority: string }) => p.authority)
    const extractedTenants = Array.isArray(tenants) ? tenants : []

    // If subdomain recognized => ensure user has that tenant => rewrite if needed
    let finalPathname = pathname
    if (isRecognizedSubdomain) {
        if (!extractedTenants.includes(maybeSubdomain)) {
            // user not authorized for that tenant
            return NextResponse.rewrite(new URL("/unauthorized", request.url))
        }
        // If path not already /{tenant}/..., rewrite
        if (!pathname.startsWith(`/${maybeSubdomain}/`)) {
            const newUrl = request.nextUrl.clone()
            newUrl.pathname = `/${maybeSubdomain}${pathname}`
            const updatedHeaders = new Headers(request.headers)
            const cookieVal = request.headers.get("cookie")
            if (cookieVal) {
                updatedHeaders.set("cookie", cookieVal)
            }
            updatedHeaders.set("x-user-permissions", JSON.stringify(extractedPermissions))
            updatedHeaders.set("x-user-name", username)
            updatedHeaders.set("x-user-tenants", JSON.stringify(extractedTenants))
            updatedHeaders.set("x-active-tenant", maybeSubdomain)

            return NextResponse.rewrite(newUrl, {
                request: {
                    headers: updatedHeaders,
                },
            })
        }
        finalPathname = pathname // now /{tenant}/whatever
    }

    // Check route-level permission ignoring the subdomain prefix
    const barePath = getBarePathname(finalPathname, isRecognizedSubdomain ? maybeSubdomain : "")
    const requiredPermission = getRequiredPermission(barePath)
    if (requiredPermission && !extractedPermissions.includes(requiredPermission)) {
        return NextResponse.rewrite(new URL("/unauthorized", request.url))
    }

    // Set x-user-* headers for SSR
    const updatedHeaders = new Headers(request.headers)
    const cookieVal = request.headers.get("cookie")
    if (cookieVal) {
        updatedHeaders.set("cookie", cookieVal)
    }
    updatedHeaders.set("x-user-permissions", JSON.stringify(extractedPermissions))
    updatedHeaders.set("x-user-name", username)
    updatedHeaders.set("x-user-tenants", JSON.stringify(extractedTenants))
    if (isRecognizedSubdomain) {
        updatedHeaders.set("x-active-tenant", maybeSubdomain)
    }

    return NextResponse.next({
        request: {
            headers: updatedHeaders,
        },
    })
}

// We match all routes, then skip the special ones in the middleware logic above
export const config = {
    matcher: ["/:path*"],
}
