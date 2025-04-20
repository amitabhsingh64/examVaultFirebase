"use client";

import AuthForm from "@/app/components/auth-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { app } from "@/lib/firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SignInPage() {
  const [isStudent, setIsStudent] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      // After successful sign-in, redirect based on user role (example)
      // In a real application, you'd likely fetch user role from your database
      toast({
        title: "Sign in successful!",
        description: "Redirecting to dashboard...",
      });
      router.push(isStudent ? "/dashboard" : "/admin/dashboard");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          AI Proctored <span className="text-primary">Exam Portal</span>
        </h1>
        <AuthForm isStudent={isStudent} setIsStudent={setIsStudent} />
        <Button variant="outline" className="mt-4" onClick={handleGoogleSignIn}>
          Sign In with Google
        </Button>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p className="text-muted-foreground">Powered by Firebase Studio</p>
      </footer>
    </div>
  );
}
