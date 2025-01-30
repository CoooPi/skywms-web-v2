import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions/auth"
import { getTenantConfig } from "@/lib/tenantConfig"

interface Props {
    params: Promise<{tenant: string}>;
}

export default async function TenantLoginPage(props: Props) {
    const { params } = props;
    const { tenant } = await params;
    const tenantConfig = getTenantConfig(tenant);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md space-y-12">
                <div className="text-center">
                    <Image
                        src={tenantConfig.logoPath || "/fallback-logo.png"}
                        alt={tenantConfig.displayName}
                        width={512}
                        height={512}
                        className="mx-auto"
                    />
                </div>
                <form
                    action={login}
                    className="mt-8 space-y-6"
                >
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="block text-sm font-medium">
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1"
                                placeholder=""
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1"
                                placeholder=""
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Log in
                    </Button>
                </form>
            </div>
        </div>
    )
}