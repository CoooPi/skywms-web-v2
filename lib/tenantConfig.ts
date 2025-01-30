/**
 * A simple file to store or retrieve tenant-specific configurations
 * based on the subdomain name.
 */

type TenantConfig = {
    displayName: string
    themeColor: string
    logoPath: string
    additionalFeatures?: Record<string, boolean>
}

/**
 * Replace these with actual subdomain config as you need.
 * For example, "tenantA" for "tenantA.localhost:3000".
 */
export const TENANT_CONFIG: Record<string, TenantConfig> = {
    apohem: {
        displayName: "Apohem",
        themeColor: "186, 71%, 45%",
        logoPath: "/apohem.png",
        additionalFeatures: {
        },
    },
    amazon: {
        displayName: "Amazon",
        themeColor: "35, 100%, 50%",
        logoPath: "/amazon.png",
        additionalFeatures: {
        },
    },
    // Add more as needed
}

/**
 * Retrieve config for a given subdomain. Fallback to a default if not recognized.
 */
export function getTenantConfig(subdomain: string): TenantConfig {
    return TENANT_CONFIG[subdomain];
}