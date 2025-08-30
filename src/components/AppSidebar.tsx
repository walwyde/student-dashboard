import * as React from 'react';
import Link from "next/link";
import { usePathname, useRouter} from "next/navigation";
import { 
  User, 
  CreditCard, 
  BookOpen, 
  Users, 
  Settings,
  LogOut,
  GraduationCap,
  UserPlus,
  School
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/src/components/ui/sidebar";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";

import { fetchProfile } from "../Actions/profileActions";

const studentItems = [
  { title: "Dashboard", url: "/dashboard", icon: User },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "My ID Card", url: "/dashboard/id-card", icon: CreditCard },
  { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Lecturers", url: "/dashboard/lecturers", icon: School },
];

const adminItems = [
  { title: "Admin Dashboard", url: "/admin", icon: Settings },
  { title: "Manage Students", url: "/admin/students", icon: UserPlus },
  { title: "Manage Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Manage Lecturers", url: "/admin/lecturers", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const location = usePathname();
  const router = useRouter();
  const currentPath = location || "/dashboard";
  const [profile, setProfile] = React.useState(null)

const loadProfile = async() => {
  const profileData = await fetchProfile(user?.id)
  setProfile(profileData)
}

React.useEffect(() => {
  loadProfile()
}, [user?.id])

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "hover:bg-sidebar-accent/50";

  const isAdmin = user?.role === 'admin';
  const menuItems = isAdmin ? [...studentItems, ...adminItems] : studentItems;

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">UniID System</h2>
              <p className="text-xs text-sidebar-foreground/60">Student Portal</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isAdmin ? "Navigation" : "Student Portal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={getNavCls({ isActive: isActive(item.url) })}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {user && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize">
                    {user?.role || "student"}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {signOut
                router.replace("/auth")
              }}
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}