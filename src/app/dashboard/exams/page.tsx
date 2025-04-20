"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);

    useEffect(() => {
        const getCameraPermission = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                toast({
                    variant: 'destructive',
                    title: 'Camera Access Denied',
                    description: 'Please enable camera permissions in your browser settings to use this app.',
                });
            }
        };

        getCameraPermission();
    }, []);


    useEffect(() => {
        const fetchExam = async () => {
            if (!examId) {
                toast({
                    title: 'Error: Exam ID not found.',
                    variant: 'destructive',
                });
                router.push("/dashboard");
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
                    router.push("/dashboard");
                }
            } catch (error: any) {
                console.error('Error fetching exam:', error);
                toast({
                    title: 'Error fetching exam.',
                    description: error.message,
                    variant: 'destructive',
                });
                router.push("/dashboard");
            }
        };

        fetchExam();
    }, [examId, toast, router]);

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
        <div className="flex h-screen bg-background">
            <div className="w-2/3 p-4 space-y-4">
                <Card className="h-full flex flex-col">
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">{exam.examName}</h2>
                            <div className="flex items-center space-x-2 text-lg">
                                <Clock className="h-5 w-5" />
                                <span>{formatTime(timer)}</span>
                            </div>
                        </div>
                        <div className="mb-4 p-4 rounded-md bg-secondary">
                            <h3 className="text-xl font-semibold">Question {currentQuestionIndex + 1}</h3>
                            <p>{currentQuestion.questionText}</p>
                            <Separator className="my-2" />
                            {currentQuestion.options && currentQuestion.options.length > 0 ? (
                                <RadioGroup value={studentAnswers[currentQuestionIndex]} onValueChange={(value) => handleOptionSelect(value)}>
                                    {currentQuestion.options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`option-${index}`} className="h-5 w-5" />
                                            <label htmlFor={`option-${index}`} className="cursor-pointer">{option}</label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <p>No options available for this question.</p>
                            )}
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
                    </CardContent>
                </Card>
            </div>
            <div className="w-1/3 p-4 space-y-4">
                <Card className="h-1/2">
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-2">Video preview</h3>
                        <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
                        {!(hasCameraPermission) && (
                            <Alert variant="destructive">
                                <AlertTitle>Camera Access Required</AlertTitle>
                                <AlertDescription>
                                    Please allow camera access to use this feature.
                                </AlertDescription>
                            </Alert>
                        )
                        }
                    </CardContent>
                </Card>
                <Card className="h-1/2">
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-2">Questions and Status</h3>
                        <p>Progress: {currentQuestionIndex + 1} / {questions.length}</p>
                        <div className="overflow-y-auto h-32">
                            {questions.map((question, index) => (
                                <div key={index} className="py-1">
                                    Question {index + 1}: {question.questionText.substring(0, 50)}...
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
