'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  FirebaseError,
} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {Textarea} from '@/components/ui/textarea';
import {z} from 'zod';
import {useForm} from 'react-hook-form';

// Zod schema for form validation
const examSchema = z.object({
  examName: z.string().min(3, {
    message: 'Exam name must be at least 3 characters.',
  }),
  scheduledDate: z.string().min(1, {
    message: 'Please select a date',
  }),
  questions: z
    .string()
    .min(10, {message: 'Questions must be at least 10 characters long.'}),
});

export default function ExamScheduling() {
  const router = useRouter();
  useEffect(() => {
    document.title = 'Exam Scheduling';
  }, []);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [examName, setExamName] = useState('');
  const [questions, setQuestions] = useState('');
  const {toast} = useToast();

  const handleScheduleExam = async () => {
    if (!date || !examName || !questions) {
      toast({
        title: 'Error scheduling exam.',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const examsCollection = collection(db, 'exams');
      await addDoc(examsCollection, {
        examName: examName,
        scheduledDate: date.toISOString(),
        questions: questions,
      });

      toast({
        title: 'Exam scheduled successfully!',
        description: `The exam "${examName}" has been scheduled for ${date.toLocaleDateString()}.`,
      });

      // Clear the form
      setDate(undefined);
      setExamName('');
      setQuestions('');
    } catch (e: any) {
      toast({
        title: 'Error scheduling exam.',
        description: e.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Exam Scheduling</h1>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="examName">Exam Name</Label>
          <Input
            type="text"
            id="examName"
            placeholder="Enter exam name"
            value={examName}
            onChange={e => setExamName(e.target.value)}
          />
        </div>

        <div>
          <Label>Scheduled Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={d =>
                  d < new Date(new Date().setDate(new Date().getDate() - 1))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="questions">Questions</Label>
          <Textarea
            id="questions"
            placeholder="Enter questions"
            value={questions}
            onChange={e => setQuestions(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <Button onClick={handleScheduleExam}>Schedule Exam</Button>
      </div>
    </div>
  );
}
