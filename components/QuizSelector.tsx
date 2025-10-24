
import React, { useState, useMemo } from 'react';
// import { db } from '../firebase-config';
// import { useLocalStorage } from '../hooks/useLocalStorage';
import { QuizDocument } from '../types.ts';

interface QuizSelectorProps {
  onSelectQuiz: (quiz: QuizDocument) => void;
}

const DUMMY_QUIZZES: QuizDocument[] = [
    {
        id: '1',
        title: 'Basic Multiplication',
        category: 'Math',
        questions: [
            { question: '2 × 2', questionType: 'number', correctAnswer: 4 },
            { question: '3 × 5', questionType: 'number', correctAnswer: 15 },
            { question: '10 × 8', questionType: 'number', correctAnswer: 80 },
        ],
    },
    {
        id: '2',
        title: 'Capital Cities',
        category: 'Geography',
        questions: [
            { question: 'Capital of France?', questionType: 'mcq', correctAnswer: 'Paris', options: ['London', 'Paris', 'Berlin', 'Madrid'] },
            { question: 'Capital of Japan?', questionType: 'mcq', correctAnswer: 'Tokyo', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'] },
        ],
    },
    {
        id: '3',
        title: 'Advanced Multiplication',
        category: 'Math',
        questions: [
            { question: '12 × 12', questionType: 'number', correctAnswer: 144 },
            { question: '15 × 15', questionType: 'number', correctAnswer: 225 },
        ]
    }
];


const QuizCard: React.FC<{ quiz: QuizDocument, onSelect: () => void }> = ({ quiz, onSelect }) => (
    <button
        onClick={onSelect}
        className="w-full text-left p-4 border border-slate-200 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150"
    >
        <p className="text-sm font-semibold text-blue-600">{quiz.category}</p>
        <h3 className="text-lg font-bold text-slate-800">{quiz.title}</h3>
        <p className="text-xs text-slate-500 mt-1">{quiz.questions.length} questions</p>
    </button>
);

const QuizSelector: React.FC<QuizSelectorProps> = ({ onSelectQuiz }) => {
  const [quizzes] = useState<QuizDocument[]>(DUMMY_QUIZZES);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'quizzes'));
//         const quizzesData = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as QuizDocument[];
//         setQuizzes(quizzesData);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching quizzes:", err);
//         setError("Failed to load quizzes from the database. Please check your connection or Firebase setup.");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     // Load from cache first
//     if (quizzes.length > 0) {
//         setLoading(false);
//     }
//     // Then fetch fresh data
//     fetchQuizzes();
//   }, [setQuizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quizzes, searchTerm]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 sticky top-0 bg-white/80 backdrop-blur-sm pt-2 pb-4">
        <input
          type="text"
          placeholder="Search quizzes by title or category..."
          className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <div className="text-center text-slate-500">Loading quizzes...</div>}
      {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
      
      {!loading && !error && (
        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
            {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map(quiz => (
                    <QuizCard key={quiz.id} quiz={quiz} onSelect={() => onSelectQuiz(quiz)} />
                ))
            ) : (
                <div className="text-center text-slate-500 pt-10">No quizzes found.</div>
            )}
        </div>
      )}
    </div>
  );
};

export default QuizSelector;