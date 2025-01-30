import { logout } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

// A minimal unauthorized page.
export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
            <h1 className="text-2xl font-semibold">Unauthorized</h1>
            <p className="max-w-md">
                You do not have the necessary permissions to access this page.
            </p>
            <form action={logout}>
                <Button type="submit">
                    Log out
                </Button>
            </form>
        </main>
    )
}