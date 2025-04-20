"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Exam {
    id: string;
    examName: string;
    scheduledDate: string;
    questions: string;
}

export default function ExamInterface() {
    const router = useRouter();
    const [exam, setExam] = useState<Exam | null>(null);
    const [timer, setTimer] = useState(3600); // Example timer in seconds (1 hour)

    useEffect(() => {
        // TODO: Fetch the exam details based on examId from URL params or context
        // For now, using a dummy exam
        const dummyExam = {
            id: '1',
            examName: 'Sample Exam',
            scheduledDate: new Date().toISOString(),
            questions: 'Question 1, Question 2, Question 3',
        };
        setExam(dummyExam);
    }, []);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else {
            // TODO: Handle exam submission when timer reaches 0
            clearInterval(interval);
            alert('Time is up!');
        }
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!exam) {
        return <div>Loading Exam...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="w-full">
                <CardContent className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">{exam.examName}</h2>
                        <div className="flex items-center space-x-2 text-lg">
                            <Clock className="h-5 w-5" />
                            <span>{formatTime(timer)}</span>
                        </div>
                    </div>
                    <div>
                        {/* TODO: Implement Question Display and Navigation */}
                        <p>Questions: {exam.questions}</p>
                    </div>
                    <div className="flex justify-between">
                        <Button variant="secondary">Previous</Button>
                        <Button>Next</Button>
                    </div>
                    <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
                </CardContent>
            </Card>
        </div>
    );
}
