"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Welcome to the AI Proctored Exam Portal!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          This portal provides a secure and reliable environment for conducting online exams with AI-powered proctoring.
        </p>
        <Button onClick={() => router.push("/signin")}>
          Get Started
        </Button>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="text-muted-foreground">Powered by Firebase Studio</p>
      </footer>
    </div>
  );
}

