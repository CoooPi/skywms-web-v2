import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import type { Location } from "@/types/LocationTypes"

interface LocationCardProps {
    location: Location
}

export function LocationCard({ location }: LocationCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">{location.name}</CardTitle>
                <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit location</span>
                </Button>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                        <dt className="font-medium text-muted-foreground">Volume</dt>
                        <dd>{location.volume !== null ? `${location.volume} m³` : "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-muted-foreground">Path Index</dt>
                        <dd>{location.pathIndex !== null ? location.pathIndex : "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-muted-foreground">Location Types</dt>
                        <dd>{location.locationTypeNames.length > 0 ? location.locationTypeNames.join(", ") : "None"}</dd>
                    </div>
                    <div>
                        <dt className="font-medium text-muted-foreground">Parent Location</dt>
                        <dd>{location.parentLocationName || "None"}</dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    )
}
