"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-500">Examplify!</span>
        </h1>

        <p className="mt-3 text-2xl">
          Please log in to continue.
        </p>

        <div className="mt-6">
          <Button onClick={() => router.push("/dashboard")}>
            Log In
          </Button>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p>
          Powered by Firebase Studio
        </p>
      </footer>
    </div>
  );
}
