
import React, { useState, useEffect, useRef } from 'react';
import { Question, Settings, TestResult, AnswerRecord } from '../types';
import { useTimer } from '../hooks/useTimer';
import CustomNumpad from './CustomNumpad';

interface QuizProps {
  questions: Question[];
  settings: Settings;
  onQuizEnd: (result: TestResult) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, settings, onQuizEnd }) => {
  const [currentQueue, setCurrentQueue] = useState<Question[]>(() => [...questions]);
  const [answers, setAnswers] = useState<AnswerRecord[]>(() => questions.map(q => ({
      question: q,
      userAnswer: null,
      attempts: [],
      isCorrect: false,
  })));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isNumpadVisible, setIsNumpadVisible] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const [time, stopTimer] = useTimer(true);

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    if (numberInputRef.current) {
        numberInputRef.current.focus();
    }
  }, [currentIndex]);
  
  const finishQuiz = () => {
    stopTimer();
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    answers.forEach(ans => {
        if (ans.userAnswer === null) {
            skipped++;
        } else if (ans.isCorrect) {
            correct++;
        } else {
            wrong++;
        }
    });

    onQuizEnd({
      date: new Date().toISOString(),
      time,
      score: `${correct}/${questions.length}`,
      correct,
      wrong,
      skipped,
      answers,
    });
  };

  const nextQuestion = () => {
    setInputValue('');
    if (currentIndex + 1 < currentQueue.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };
  
  const handleWrongAnswer = (q: Question, answer: string | number) => {
    setShake(true);
    setTimeout(() => setShake(false), 500);

    const originalIndex = questions.findIndex(originalQ => originalQ.question === q.question);
    if (originalIndex !== -1) {
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[originalIndex].attempts.push(answer);
            return newAnswers;
        });
    }

    if (settings.repeatWrong) {
        const nextIndex = Math.min(currentQueue.length, currentIndex + 2 + Math.floor(Math.random() * 2));
        setCurrentQueue(prev => [...prev.slice(0, nextIndex), q, ...prev.slice(nextIndex)]);
    }
  };

  const handleAnswer = (answer: string | number) => {
    const currentQuestion = currentQueue[currentIndex];
    const isCorrect = String(answer).trim() === String(currentQuestion.correctAnswer).trim();

    const originalIndex = questions.findIndex(q => q.question === currentQuestion.question);

    if (isCorrect) {
        if (originalIndex !== -1 && answers[originalIndex].userAnswer === null) {
            setAnswers(prev => {
                const newAnswers = [...prev];
                newAnswers[originalIndex].userAnswer = answer;
                newAnswers[originalIndex].isCorrect = true;
                return newAnswers;
            });
        }
      nextQuestion();
    } else {
      handleWrongAnswer(currentQuestion, answer);
      if(currentQuestion.questionType === 'number') {
        setInputValue('');
      }
    }
  };

  const currentQ = currentQueue[currentIndex];

  if (!currentQ) {
    return <div className="text-center p-8">Loading question...</div>;
  }
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (String(currentQ.correctAnswer).length === val.length) {
      handleAnswer(val);
    }
  }

  return (
    <div className="flex flex-col gap-4">
        <div className="fixed top-4 right-4 bg-white/80 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full shadow-md text-lg font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{time}</span>
        </div>
      <p className="text-center text-slate-500 font-medium">Question {currentIndex + 1} of {currentQueue.length}</p>
      <div className={`bg-white p-6 rounded-lg shadow-md flex flex-col items-center gap-6 transition-transform duration-500 ${shake ? 'animate-shake' : ''}`}>
        <h2 className="text-3xl font-bold text-center text-slate-900">{currentQ.question}</h2>
        <div className="w-full max-w-sm">
          {currentQ.questionType === 'mcq' && (
            <div className="grid grid-cols-2 gap-4">
              {currentQ.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  className="p-4 border-2 border-slate-200 rounded-lg text-lg font-medium text-slate-700 hover:bg-slate-100 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          {currentQ.questionType === 'number' && (
            <input
              ref={numberInputRef}
              type="number"
              readOnly={isMobile && settings.useCustomNumpad}
              inputMode={isMobile && settings.useCustomNumpad ? 'none' : 'decimal'}
              className="w-full text-center text-2xl p-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="उत्तर लिखो"
              value={inputValue}
              onChange={handleNumberInputChange}
              onFocus={() => settings.useCustomNumpad && isMobile && setIsNumpadVisible(true)}
              onBlur={() => setTimeout(() => setIsNumpadVisible(false), 100)} // delay to allow numpad clicks
            />
          )}
        </div>
      </div>
       <div className="flex justify-center mt-4">
        <button onClick={finishQuiz} className="text-slate-500 hover:text-red-600 font-medium transition-colors">End Quiz</button>
      </div>
      {isMobile && settings.useCustomNumpad && isNumpadVisible && (
        <CustomNumpad 
            onKeyPress={(key) => {
                const newValue = inputValue + key;
                setInputValue(newValue);
                if (String(currentQ.correctAnswer).length === newValue.length) {
                    handleAnswer(newValue);
                }
            }}
            onBackspace={() => setInputValue(val => val.slice(0, -1))}
            onEnter={() => handleAnswer(inputValue)}
        />
      )}
    </div>
  );
};

export default Quiz;
