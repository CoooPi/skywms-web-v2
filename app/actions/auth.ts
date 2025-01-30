"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const cookieStore = await cookies()

    // 1) Retrieve token
    const response = await fetch(`${process.env.BACKEND_API_URL}/auth/authenticate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
        throw new Error("Login failed")
    }

    const { token } = await response.json()

    // 2) Set cookie with domain so it works across subdomains if needed
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost"
    let cookieDomain = ""
    // If not localhost, set a wildcard domain
    if (rootDomain !== "localhost") {
        cookieDomain = `.${rootDomain}`
    }
    cookieStore.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        domain: cookieDomain || undefined, // no domain on localhost
        path: "/",
    })

    // 3) Redirect to “/”, letting the middleware do subdomain logic if needed
    redirect("/")
}

export async function logout() {
    const cookieStore = await cookies()
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost"
    let cookieDomain = ""

    if (rootDomain !== "localhost") {
        cookieDomain = `.${rootDomain}`
    }

    // 1) Delete the cookie that might be on the wildcard domain
    if (cookieDomain) {
        cookieStore.delete({
            name: "token",
            domain: cookieDomain,
            path: "/",
        })
    }

    // 2) Also delete any cookie named “token” set without a domain (localhost scenario)
    //    or if subdomain usage created a separate cookie
    cookieStore.delete({
        name: "token",
        path: "/",
    })

    // Optionally, you could remove this redirect if you want the next request to see no token
    // and re-route to the tenant login. But we'll leave it as-is:
    redirect("/")
}