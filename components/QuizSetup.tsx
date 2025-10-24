
import React, { useState } from 'react';
import { Question, QuizDocument } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_QUESTIONS } from '../constants';
import Modal from './Modal';
import QuizSelector from './QuizSelector';

interface QuizSetupProps {
  onStartQuiz: (questions: Question[]) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz }) => {
  const [jsonText, setJsonText] = useLocalStorage<string>(
    'quizJson',
    JSON.stringify(DEFAULT_QUESTIONS, null, 2)
  );
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStart = () => {
    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data)) throw new Error('JSON must be an array of questions.');
      setError('');
      onStartQuiz(data);
    } catch (e) {
      if (e instanceof Error) {
        setError('Invalid JSON format: ' + e.message);
      } else {
        setError('An unknown error occurred while parsing JSON.');
      }
    }
  };

  const handleQuizSelect = (quiz: QuizDocument) => {
    setJsonText(JSON.stringify(quiz.questions, null, 2));
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-900">प्रश्न डालो</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
          >
            Load Quiz
          </button>
        </div>
        <textarea
          id="json-textarea"
          placeholder="JSON साटो"
          spellCheck="false"
          className="w-full h-64 p-3 font-mono text-xs bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          onClick={handleStart}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          अभ्यास आरंभ करे
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Load a Quiz"
      >
        <QuizSelector onSelectQuiz={handleQuizSelect} />
      </Modal>
    </>
  );
};

export default QuizSetup;
