
import React from 'react';
import { TestResult } from '../types';
import Accordion from './Accordion';

interface TestHistoryProps {
  history: TestResult[];
  setHistory: (history: TestResult[]) => void;
}

const formatRelativeTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
    });
};

const TestHistory: React.FC<TestHistoryProps> = ({ history, setHistory }) => {
    const clearHistoryAndJson = () => {
        setHistory([]);
        localStorage.removeItem('quizJson');
    };

    return (
        <div className="space-y-4">
            <Accordion title="Test History">
                {history.length > 0 ? (
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3 text-center">Time</th>
                                <th scope="col" className="px-6 py-3 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((entry, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-600">{formatRelativeTime(entry.date)}</td>
                                    <td className="px-6 py-4 text-center">{entry.time}</td>
                                    <td className="px-6 py-4 font-semibold text-blue-600 text-right">{entry.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-slate-500 p-4">No test history found.</p>
                )}
            </Accordion>
            <div className="flex justify-center">
                <button
                    onClick={clearHistoryAndJson}
                    className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors"
                >
                    Clear Cache
                </button>
            </div>
        </div>
    );
};

export default TestHistory;
