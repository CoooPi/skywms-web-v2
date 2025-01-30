import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET() {
    const headersList = await headers()
    const token = headersList.get("Authorization")?.split(" ")[1]

    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    try {
        const response = await fetch(`${process.env.BACKEND_API_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error("Failed to fetch user data")
        }

        const userData = await response.json()
        return NextResponse.json(userData)
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}

