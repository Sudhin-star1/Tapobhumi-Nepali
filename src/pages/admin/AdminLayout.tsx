import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Image, Phone, Map, Mountain, HandHeart, LogOut, Inbox, Users } from "lucide-react";

import { useAdminAuth } from "@/admin/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/experts", label: "Experts", icon: Users },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/services", label: "Services", icon: HandHeart },
  { to: "/admin/treks", label: "Treks", icon: Mountain },
  { to: "/admin/tours", label: "Tours", icon: Map },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/contact", label: "Contact Info", icon: Phone },
];

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const nav = useNavigate();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="px-2">
          <div className="flex items-center justify-between gap-2 p-2">
            <div className="font-serif text-lg">Tapobhumi</div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {items.map((it) => (
              <SidebarMenuItem key={it.to}>
                <NavLink to={it.to} end={it.end}>
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive} tooltip={it.label}>
                      <it.icon />
                      <span>{it.label}</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              logout();
              nav("/admin/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

