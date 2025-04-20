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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Dashboard() {
  const router = useRouter();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Student Dashboard";
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const examsCollection = collection(db, 'exams');
        const q = query(examsCollection, orderBy('scheduledDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const examsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExams(examsData);
      } catch (error: any) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <SidebarProvider>
      <Sidebar variant="inset" side="left" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/50/50" alt="Avatar" />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            <span className="font-bold">Student Name</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/dashboard/exams")}>
                  <Icons.home className="mr-2 h-4 w-4" />
                  <span>Exams</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/dashboard/results")}>
                  <Icons.messageSquare className="mr-2 h-4 w-4" />
                  <span>Results</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/dashboard/registration")}>
                  <Icons.settings className="mr-2 h-4 w-4" />
                  <span>Registration</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push("/dashboard/details")}>
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
        <h1 className="text-2xl font-bold">Welcome to the Student Dashboard!</h1>
        <p>Access your exams, results, and registration details from the sidebar.</p>

        <h2 className="text-xl font-semibold mt-4">Scheduled Exams</h2>
        {loading ? (
          <p>Loading exams...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Exam Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Scheduled Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Questions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map(exam => (
                  <tr key={exam.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {exam.examName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(exam.scheduledDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exam.questions.substring(0, 50)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
