import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Home() {
    // Check for a token cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value

    // If no token is present, force the user to the login page:
    if (!token) {
        redirect("/login")
    }

    // Otherwise, maybe send them to /dashboard. Adjust as needed.
    redirect("/dashboard")
}