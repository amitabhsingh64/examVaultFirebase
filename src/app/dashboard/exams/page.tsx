"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useSearchParams } from 'next/navigation';

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

    useEffect(() => {
        // TODO: Fetch the exam details based on examId from URL params or context
        // For now, using a dummy exam
        const dummyExam = {
            id: '1',
            examName: 'Sample Exam',
            scheduledDate: new Date().toISOString(),
            questions: '[{"questionText":"What is the capital of France?","questionType":"multiple-choice","options":["London","Paris","Berlin","Rome"],"correctAnswer":"Paris","category":"Geography"},{"questionText":"What is the capital of Germany?","questionType":"multiple-choice","options":["London","Paris","Berlin","Rome"],"correctAnswer":"Berlin","category":"Geography"}]',
        };
        setExam(dummyExam);
    }, [examId]);

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
        alert('Exam submitted!');
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
