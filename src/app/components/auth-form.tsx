"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface AuthFormProps {
  isStudent: boolean;
  setIsStudent: (isStudent: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isStudent, setIsStudent }) => {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (isStudent) {
      router.push("/dashboard");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
      <Card className="w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access the {isStudent ? "student" : "admin"} portal
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex gap-2">
            <Button
              variant={isStudent ? "default" : "outline"}
              onClick={() => setIsStudent(true)}
              className="w-1/2"
            >
              Student
            </Button>
            <Button
              variant={!isStudent ? "default" : "outline"}
              onClick={() => setIsStudent(false)}
              className="w-1/2"
            >
              Admin
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              placeholder="Enter your roll number"
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" size="sm">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleSignIn}>
            Sign in
          </Button>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-xs text-muted-foreground">
            Student demo: Use any roll number between 100-120 with any password
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
