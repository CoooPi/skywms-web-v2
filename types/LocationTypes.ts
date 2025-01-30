export interface SubLocation {
    name: string;
    volume: number | null;
    pathIndex: number | null;
    locationTypeNames: string[];
}

export interface Location {
    name: string;
    volume: number | null;
    pathIndex: number | null;
    locationTypeNames: string[];
    subLocations: SubLocation[];
    parentLocationName: string | null;
}

export interface LocationTypeRule {
    allowedParentTypeName: string;
    allowedChildTypeName: string;
}

export interface LocationType {
    name: string;
}