"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  return (
    <SidebarProvider>
      <Sidebar variant="inset" side="left" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/50/50" alt="Avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="font-bold">Admin User</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/exams")}>
                  <Icons.home className="mr-2 h-4 w-4" />
                  <span>Exams</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/exam-scheduling")}>
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  <span>Exam Scheduling</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/results")}>
                  <Icons.messageSquare className="mr-2 h-4 w-4" />
                  <span>Results</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/proctoring-records")}>
                  <Icons.shield className="mr-2 h-4 w-4" />
                  <span>Proctoring Records</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/admin/details")}>
                  <Icons.user className="mr-2 h-4 w-4" />
                  <span>Details</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 p-4">
        {/* Main content area */}
        <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard!</h1>
        <p>Manage exams, scheduling, results, and proctoring records from the sidebar.</p>
      </div>
    </SidebarProvider>
  );
}
