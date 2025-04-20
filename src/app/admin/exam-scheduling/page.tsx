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
  FirebaseError,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import {db} from '@/lib/firebase';
import {Textarea} from '@/components/ui/textarea';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from '@/components/ui/alert-dialog';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';

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

interface Question {
  questionText: string;
  questionType: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

export default function ExamScheduling() {
  const router = useRouter();
  useEffect(() => {
    document.title = 'Exam Scheduling';
  }, []);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [examName, setExamName] = useState('');
  const [questions, setQuestions] = useState('');
  const {toast} = useToast();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const examsCollection = collection(db, 'exams');
      const q = query(examsCollection, orderBy('scheduledDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const examsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExams(examsData);
    } catch (error: any) {
      console.error('Error fetching exams:', error);
      toast({
        title: 'Failed to fetch exams',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: 'Error: No file selected.',
        variant: 'destructive',
      });
      return;
    }

    if (file.type !== 'text/csv') {
      toast({
        title: 'Error: Invalid file format.',
        description: 'Please upload a CSV file.',
        variant: 'destructive',
      });
      return;
    }

    setCsvFile(file);

    //   const reader = new FileReader();
    //   reader.onload = async (e) => {
    //     const text = e.target?.result as string;
    //     try {
    //       const parsedQuestions = parseCSV(text);
    //       setQuestions(JSON.stringify(parsedQuestions, null, 2)); // Format as JSON for display
    //     } catch (error: any) {
    //       toast({
    //         title: 'Error parsing CSV file.',
    //         description: error.message,
    //         variant: 'destructive',
    //       });
    //       console.error('CSV Parsing Error:', error.message);
    //     }
    //   };
    //   reader.readAsText(file);
  };

  const parseCSV = (csvText: string): Question[] => {
    const lines = csvText.split('\n');
    const header = lines[0].split(',').map(header => header.trim());
    const expectedHeaders = ['Question Text', 'Question Type', 'Options', 'Correct Answer', 'Category'];

    if (!expectedHeaders.every(expectedHeader => header.includes(expectedHeader))) {
      throw new Error(`CSV file must contain the following headers: ${expectedHeaders.join(', ')}`);
    }

    const questions: Question[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      const values = line.split(',').map(value => value.trim());
      if (values.length !== header.length) {
        console.warn(`Skipping line ${i + 1} due to incorrect number of columns.`);
        continue;
      }

      const questionText = values[header.indexOf('Question Text')];
      const questionType = values[header.indexOf('Question Type')];
      const options = values[header.indexOf('Options')].split(';').map(opt => opt.trim());
      const correctAnswer = values[header.indexOf('Correct Answer')];
      const category = values[header.indexOf('Category')];

      questions.push({
        questionText,
        questionType,
        options,
        correctAnswer,
        category,
      });
    }
    return questions;
  };

  const handleScheduleExam = async () => {
    if (!date || !examName || !csvFile) {
      toast({
        title: 'Error scheduling exam.',
        description: 'Please fill in all fields and upload a CSV file.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `examFiles/${csvFile.name}`);

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, csvFile);
      console.log('Uploaded a blob or file!', snapshot);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log('File available at', downloadURL);

      const examsCollection = collection(db, 'exams');
      await addDoc(examsCollection, {
        examName: examName,
        scheduledDate: date.toISOString(),
        csvFileUrl: `examFiles/${csvFile.name}`,
      });

      toast({
        title: 'Exam scheduled successfully!',
        description: `The exam "${examName}" has been scheduled for ${date.toLocaleDateString()}.`,
      });

      // Clear the form
      setDate(undefined);
      setExamName('');
      setQuestions('');
      setCsvFile(null);

      // Refresh the exams list
      fetchExams();
    } catch (e: any) {
      toast({
        title: 'Error scheduling exam.',
        description: e.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      const examDocRef = doc(db, 'exams', examId);
      await deleteDoc(examDocRef);
      toast({
        title: 'Exam deleted successfully!',
        description: `The exam has been deleted.`,
      });
      // Refresh the exams list
      fetchExams();
    } catch (error: any) {
      console.error('Error deleting exam:', error);
      toast({
        title: 'Failed to delete exam',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Exam Scheduling</h1>

      <div className="grid gap-4 mb-5">
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
          <Label htmlFor="csvFile">Upload Questions (CSV)</Label>
          <Input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={handleFileUpload}
          />
          {csvFile && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected file: {csvFile.name}
            </p>
          )}
        </div>

        {/* <div>
          <Label htmlFor="questions">Questions</Label>
          <Textarea
            id="questions"
            placeholder="Enter questions"
            value={questions}
            onChange={e => setQuestions(e.target.value)}
            className="min-h-[100px]"
          />
        </div> */}

        <Button onClick={handleScheduleExam}>Schedule Exam</Button>
      </div>

      <h2 className="text-2xl font-bold mb-3">Scheduled Exams</h2>
      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Exam Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Scheduled Date
                </th>
                {/* <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Questions
                </th> */}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map(exam => (
                <tr key={exam.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {exam.examName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(exam.scheduledDate).toLocaleDateString()}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exam.questions.substring(0, 50)}...
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the exam from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteExam(exam.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
