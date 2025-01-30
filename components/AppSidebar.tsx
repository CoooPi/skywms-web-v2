"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, LucideLayoutDashboard, LucidePackageMinus, LucideWarehouse, Settings, Users } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getServerSideNav, type NavGroup } from "./ServerSideNav"
import { NavUser } from "./NavUser"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"
import {NavTenant} from "@/components/NavTenant";

export function AppSidebar() {
    // The shape of the data returned by getServerSideNav
    const [navData, setNavData] = React.useState<{
        navGroups: NavGroup[],
        tenantEntries: { name: string; logo: string }[],
    }>({
        navGroups: [],
        tenantEntries: [],
    })

    React.useEffect(() => {
        ;(async () => {
            const result = await getServerSideNav()
            setNavData(result)
        })()
    }, [])

    // State for collapsible items
    const [openItems, setOpenItems] = React.useState<string[]>([])

    const toggleItem = (title: string) => {
        setOpenItems((prevOpenItems) =>
            prevOpenItems.includes(title) ? prevOpenItems.filter((item) => item !== title) : [...prevOpenItems, title]
        )
    }

    return (
        <Sidebar className="border-r">
            <SidebarHeader>
                {/* We add our TenantSwitcher here */}
                <NavTenant tenants={navData.tenantEntries} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {navData.navGroups.map((group) => (
                            <Collapsible
                                key={group.title}
                                open={openItems.includes(group.title)}
                                onOpenChange={() => toggleItem(group.title)}
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            {getIcon(group.title)}
                                            <span>{group.title}</span>
                                            <ChevronDown
                                                className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                                                    openItems.includes(group.title) ? "rotate-180" : ""
                                                }`}
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="mt-1">
                                        <SidebarMenuSub>
                                            {group.items.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={item.url}>{item.title}</Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser
                    user={{
                        name: "Theo Emanuelsson",
                        username: "theoem",
                        avatar: "/placeholder.svg?height=32&width=32",
                    }}
                />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

// Helper function for the group icons
function getIcon(title: string) {
    switch (title) {
        case "Dashboards":
            return <LucideLayoutDashboard className="mr-2 h-4 w-4" />
        case "Delivery":
            return <LucidePackageMinus className="mr-2 h-4 w-4" />
        case "Warehouse":
            return <LucideWarehouse className="mr-2 h-4 w-4" />
        case "Architecture":
            return <Settings className="mr-2 h-4 w-4" />
        case "Community":
            return <Users className="mr-2 h-4 w-4" />
        default:
            return null
    }
}
