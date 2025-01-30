// File: /Users/theo/Documents/WebstormProjects/skywms-shad/lib/themes.ts

import { getTenantConfig } from "@/lib/tenantConfig";

/**
 * Sets the primary color, ring, and sidebarPrimary from tenantConfig,
 * based on the subdomain’s “themeColor” property.
 */
export default function setTenantTheme(tenantName: string) {
    const tenantCfg = getTenantConfig(tenantName);

    // Use the “themeColor” from tenantConfig to drive our CSS variables.
    // If you need more variables (e.g. accent, destructive, etc.), add them here.
    document.documentElement.style.setProperty("--primary", tenantCfg.themeColor);
    document.documentElement.style.setProperty("--ring", tenantCfg.themeColor);
    document.documentElement.style.setProperty("--sidebar-primary", tenantCfg.themeColor);
    document.documentElement.style.setProperty("--sidebar-border", tenantCfg.themeColor);
}
