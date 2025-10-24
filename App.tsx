
import React, { useState, useCallback } from 'react';
import { Settings, Question, TestResult } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import SettingsComponent from './components/Settings';
import QuizSetup from './components/QuizSetup';
import Quiz from './components/Quiz';
import QuizResult from './components/QuizResult';
import TestHistory from './components/TestHistory';

type QuizState = 'setup' | 'active' | 'result';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const [settings, setSettings] = useLocalStorage<Settings>('quizSettings', {
    shuffle: false,
    repeatWrong: false,
    repeatSet: 1,
    useCustomNumpad: true,
  });

  const [testHistory, setTestHistory] = useLocalStorage<TestResult[]>('testHistory', []);

  const handleStartQuiz = useCallback((loadedQuestions: Question[]) => {
    let finalQuestions = [];
    for (let i = 0; i < settings.repeatSet; i++) {
      finalQuestions.push(...loadedQuestions.map(q => ({ ...q })));
    }

    if (settings.shuffle) {
      for (let i = finalQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalQuestions[i], finalQuestions[j]] = [finalQuestions[j], finalQuestions[i]];
      }
    }
    
    setQuestions(finalQuestions);
    setQuizState('active');
  }, [settings]);

  const handleQuizEnd = useCallback((result: TestResult) => {
    setTestResult(result);
    const newHistory = [result, ...testHistory].slice(0, 10);
    setTestHistory(newHistory);
    setQuizState('result');
  }, [testHistory, setTestHistory]);

  const handleStartNewQuiz = useCallback(() => {
    setQuestions([]);
    setTestResult(null);
    setQuizState('setup');
  }, []);
  
  const renderContent = () => {
    switch (quizState) {
      case 'active':
        return <Quiz questions={questions} settings={settings} onQuizEnd={handleQuizEnd} />;
      case 'result':
        return testResult && <QuizResult result={testResult} onStartNewQuiz={handleStartNewQuiz} />;
      case 'setup':
      default:
        return <QuizSetup onStartQuiz={handleStartQuiz} />;
    }
  };

  const navigateToDashboard = () => {
    window.location.href = 'dashboard.html';
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-900">मेरा अभ्यास</h1>
          {quizState === 'setup' && <SettingsComponent settings={settings} setSettings={setSettings} />}
        </header>

        <main className="flex-grow">
          {renderContent()}
        </main>

        <footer className="mt-8">
          <TestHistory history={testHistory} setHistory={setTestHistory} />
           <div className="text-center mt-4">
              <button
                onClick={navigateToDashboard}
                className="text-sm text-blue-600 hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
              >
                Manage Quizzes (Dashboard)
              </button>
            </div>
        </footer>
      </div>
    </div>
  );
};

export default App;