
import React from 'react';
import { TestResult, AnswerRecord } from '../types.ts';

interface QuizResultProps {
  result: TestResult;
  onStartNewQuiz: () => void;
}

const StatCard: React.FC<{ label: string; value: string | number; color: string }> = ({ label, value, color }) => (
  <div className="bg-slate-100 p-4 rounded-lg text-center">
    <p className="text-sm text-slate-500 font-medium">{label}</p>
    <strong className={`text-3xl font-bold ${color}`}>{value}</strong>
  </div>
);

const AnswerSummary: React.FC<{ answer: AnswerRecord }> = ({ answer }) => {
    const isWrong = !answer.isCorrect;
    const bgColor = isWrong ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
    
    return (
        <div className={`p-4 border rounded-lg ${bgColor}`}>
            <strong className="font-medium text-slate-800">{answer.question.question}</strong>
            <div className="flex justify-between items-center mt-2 text-sm">
                <span className={isWrong ? 'text-red-700' : 'text-green-700'}>
                    Your answer: {answer.userAnswer ?? '(Skipped)'}
                </span>
                <span className="text-slate-600">
                    Correct: {answer.question.correctAnswer}
                </span>
            </div>
            {answer.attempts.length > 0 && (
                <div className="mt-1 text-xs text-slate-500">
                    Previous attempts: {answer.attempts.join(', ')}
                </div>
            )}
        </div>
    );
};

const QuizResult: React.FC<QuizResultProps> = ({ result, onStartNewQuiz }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-6 animate-fade-in">
      <h2 className="text-2xl font-semibold text-center text-slate-900">Quiz Summary</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Score" value={result.score} color="text-blue-600" />
        <StatCard label="Time Taken" value={result.time} color="text-green-600" />
      </div>

      <div className="text-md font-medium text-slate-700 space-y-2">
          <div className="flex justify-between"><p>Correct Answers:</p><strong>{result.correct}</strong></div>
          <div className="flex justify-between"><p>Wrong Answers:</p><strong>{result.wrong}</strong></div>
          <div className="flex justify-between"><p>Questions Skipped:</p><strong>{result.skipped}</strong></div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-3">Questions Summary:</h3>
        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-2">
            {result.answers.map((ans, i) => (
                <AnswerSummary key={i} answer={ans} />
            ))}
        </div>
      </div>

      <button
        onClick={onStartNewQuiz}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Start New Quiz
      </button>
    </div>
  );
};

export default QuizResult;