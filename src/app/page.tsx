"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          AI Proctored <span className="text-primary">Exam Portal</span>
        </h1>

        <p className="mt-3 text-lg text-muted-foreground">
          A secure platform for conducting online examinations with AI proctoring
          to ensure academic integrity.
        </p>

        <div className="mt-12 flex justify-center gap-8">
          <div className="w-80 rounded-lg border shadow-md p-6 bg-card">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-muted p-3">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-foreground">Student Login</h2>
              <p className="mt-2 text-muted-foreground">
                Access your exams, view results, and track your progress.
              </p>
              <Button
                className="mt-6 w-full"
                onClick={() => router.push("/dashboard")}
              >
                Login as Student
              </Button>
            </div>
          </div>

          <div className="w-80 rounded-lg border shadow-md p-6 bg-card">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-muted p-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-foreground">Admin Login</h2>
              <p className="mt-2 text-muted-foreground">
                Manage students, schedule exams, and view results.
              </p>
              <Button
                className="mt-6 w-full"
                onClick={() => router.push("/admin/dashboard")}
              >
                Login as Admin
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="text-muted-foreground">Powered by Firebase Studio</p>
      </footer>
    </div>
  );
}
