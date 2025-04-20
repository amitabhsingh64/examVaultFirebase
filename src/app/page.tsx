import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-500">Examplify!</span>
        </h1>

        <p className="mt-3 text-2xl">
          Get ready to manage and take exams with ease.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Card className="p-4 w-80">
            <CardHeader>
              <CardTitle>Student Authentication</CardTitle>
              <CardDescription>Secure login for students using Firebase and Google Sign-In.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Ensures only verified students can access the exams.</p>
            </CardContent>
          </Card>

          <Card className="p-4 w-80">
            <CardHeader>
              <CardTitle>Exam Interface</CardTitle>
              <CardDescription>User-friendly interface for taking exams with timer and navigation.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Clear layout to minimize distractions and focus on the questions.</p>
            </CardContent>
          </Card>

          <Card className="p-4 w-80">
            <CardHeader>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage exams, view statistics, and oversee student performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Centralized location for administrative tasks and insights.</p>
            </CardContent>
          </Card>

          <Card className="p-4 w-80">
            <CardHeader>
              <CardTitle>Student Proctoring</CardTitle>
              <CardDescription>Monitor students during exams to prevent cheating.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Records suspicious activities like tab switching and app minimizing.</p>
            </CardContent>
          </Card>
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
