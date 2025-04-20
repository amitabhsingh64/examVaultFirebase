"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface Question {
    questionText: string;
    questionType: string;
    options: string[];
    correctAnswer: string;
    category: string;
}

interface Exam {
    id: string;
    examName: string;
    scheduledDate: string;
    questions: string;
}

export default function ExamInterface() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const examId = searchParams.get('examId');
    const [exam, setExam] = useState<Exam | null>(null);
    const [timer, setTimer] = useState(3600); // Example timer in seconds (1 hour)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [studentAnswers, setStudentAnswers] = useState<string[]>([]); // Array to store student answers
    const { toast } = useToast();

    useEffect(() => {
        const fetchExam = async () => {
            if (!examId) {
                toast({
                    title: 'Error: Exam ID not found.',
                    variant: 'destructive',
                });
                return;
            }

            try {
                const examDoc = await getDoc(doc(db, 'exams', examId));
                if (examDoc.exists()) {
                    const examData = examDoc.data() as Exam;
                    setExam({ id: examDoc.id, ...examData });
                } else {
                    toast({
                        title: 'Error: Exam not found.',
                        variant: 'destructive',
                    });
                }
            } catch (error: any) {
                console.error('Error fetching exam:', error);
                toast({
                    title: 'Error fetching exam.',
                    description: error.message,
                    variant: 'destructive',
                });
            }
        };

        fetchExam();
    }, [examId, toast]);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else {
            // TODO: Handle exam submission when timer reaches 0
            clearInterval(interval);
            handleSubmitExam();
            toast({
                title: 'Time is up!',
                description: 'The exam has been submitted automatically.',
            });
            router.push("/dashboard");
        }
        return () => clearInterval(interval);
    }, [timer, router, toast]);

    const formatTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const questions: Question[] = exam ? JSON.parse(exam.questions) : [];

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleOptionSelect = (option: string) => {
        const newAnswers = [...studentAnswers];
        newAnswers[currentQuestionIndex] = option;
        setStudentAnswers(newAnswers);
    };

    const handleSubmitExam = async () => {
        // TODO: Save studentAnswers to Firebase or local storage
        console.log('Exam submitted!', studentAnswers);
        toast({
            title: 'Exam submitted!',
            description: 'Your answers have been saved.',
        });
        router.push("/dashboard");
    };

    if (!exam) {
        return <div>Loading Exam...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

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
                        <h3 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h3>
                        <p>{currentQuestion.questionText}</p>
                        <ul className="list-none space-y-2">
                            {currentQuestion.options.map((option, index) => (
                                <li key={index}>
                                    <label className="inline-flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            className="accent-primary h-5 w-5"
                                            name={`question-${currentQuestionIndex}`}
                                            value={option}
                                            checked={studentAnswers[currentQuestionIndex] === option}
                                            onChange={() => handleOptionSelect(option)}
                                        />
                                        <span>{option}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-between">
                        <Button variant="secondary" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                            Previous
                        </Button>
                        {currentQuestionIndex < questions.length - 1 ? (
                            <Button onClick={handleNextQuestion}>Next</Button>
                        ) : (
                            <Button onClick={handleSubmitExam}>Submit Exam</Button>
                        )}
                    </div>
                    <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
                </CardContent>
            </Card>
        </div>
    );
}
