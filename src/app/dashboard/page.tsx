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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { app } from "@/lib/firebase";

interface Exam {
  id: string;
  examName: string;
  scheduledDate: string;
  questions: string;
}

const ExamCard = ({ exam }: { exam: Exam }) => {
  const router = useRouter();
  const scheduledDate = new Date(exam.scheduledDate);
  const timeDiff = scheduledDate.getTime() - new Date().getTime();
  const hoursUntilExam = Math.ceil(timeDiff / (1000 * 60 * 60));
  const isLive = hoursUntilExam <= 0;

  const handleStartExam = () => {
    router.push(`/dashboard/exams?examId=${exam.id}`);
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{exam.examName}</h3>
          <div className="flex items-center text-sm text-muted-foreground space-x-2">
            <Clock className="h-4 w-4" />
            <span>{hoursUntilExam > 0 ? `${hoursUntilExam} hours` : 'Live'}</span>
            <Calendar className="h-4 w-4" />
            <span>{scheduledDate.toLocaleDateString()}</span>
            <span>{scheduledDate.toLocaleTimeString()}</span>
          </div>
        </div>
        {isLive && <Badge variant="destructive">Live</Badge>}
        <Button size="sm" onClick={handleStartExam}>Start Exam</Button>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState<string | null>('Student Name');
    const [googleSignIn, setGoogleSignIn] = useState(false);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setStudentName(user.displayName || 'Student Name');
                setGoogleSignIn(!!user.providerData.find(provider => provider.providerId === 'google.com'));
                setUserPhoto(user.photoURL || null);
            } else {
                setStudentName('Student Name');
                setGoogleSignIn(false);
                setUserPhoto(null);
            }
        });

        return () => unsubscribe();
    }, []);


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
        })) as Exam[];
        setExams(examsData);
      } catch (error: any) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const liveExams = exams.filter(exam => new Date(exam.scheduledDate).getTime() <= new Date().getTime());
  const upcomingExams = exams.filter(exam => new Date(exam.scheduledDate).getTime() > new Date().getTime());
  const pastExams = exams.filter(exam => new Date(exam.scheduledDate).getTime() < new Date().getTime());

    const handleLogout = async () => {
        const auth = getAuth(app);
        try {
            await signOut(auth);
            router.push("/");
        } catch (error: any) {
            console.error("Logout error:", error);
        }
    };

  return (
    <SidebarProvider>
      <Sidebar variant="inset" side="left" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={userPhoto || "https://picsum.photos/50/50"} alt="Avatar" />
              <AvatarFallback>{studentName?.substring(0, 2).toUpperCase() || 'ST'}</AvatarFallback>
            </Avatar>
            <span className="font-bold">{studentName}</span>
          </div>
            {googleSignIn && <Badge variant="outline">Google Sign-In</Badge>}
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
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Welcome to the Student Dashboard!</h1>
        <p>Access your exams, results, and registration details from the sidebar.</p>

        <h2 className="text-xl font-semibold mt-4">My Exams</h2>
        <Tabs defaultValue="live" className="w-full">
          <TabsList>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="live" className="mt-4">
            {loading ? (
              <p>Loading live exams...</p>
            ) : (
              <div className="space-y-4">
                {liveExams.map(exam => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
                {liveExams.length === 0 && <p>No live exams scheduled.</p>}
              </div>
            )}
          </TabsContent>
          <TabsContent value="upcoming" className="mt-4">
            {loading ? (
              <p>Loading upcoming exams...</p>
            ) : (
              <div className="space-y-4">
                {upcomingExams.map(exam => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
                {upcomingExams.length === 0 && <p>No upcoming exams scheduled.</p>}
              </div>
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            {loading ? (
              <p>Loading past exams...</p>
            ) : (
              <div className="space-y-4">
                {pastExams.map(exam => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
                {pastExams.length === 0 && <p>No past exams scheduled.</p>}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </SidebarProvider>
  );
}
