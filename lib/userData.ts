"use server";
import { headers } from "next/headers"

export async function getUserData() {
    const headersList = await headers()
    const permissions = JSON.parse(headersList.get("x-user-permissions") || "[]")
    const username = headersList.get("x-user-name") || ""
    const tenants = JSON.parse(headersList.get("x-user-tenants") || "[]")

    console.log("Parsed Data:", { permissions, username, tenants });
    return { permissions, username, tenants }
}