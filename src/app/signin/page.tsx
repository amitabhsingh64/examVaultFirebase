"use client";

import AuthForm from "@/app/components/auth-form";
import { useState } from "react";

export default function SignInPage() {
  const [isStudent, setIsStudent] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          AI Proctored <span className="text-primary">Exam Portal</span>
        </h1>
        <AuthForm isStudent={isStudent} setIsStudent={setIsStudent} />
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="text-muted-foreground">Powered by Firebase Studio</p>
      </footer>
    </div>
  );
}
