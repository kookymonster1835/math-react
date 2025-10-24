
import React from 'react';
import { Settings } from '../types.ts';
import Accordion from './Accordion.tsx';

interface SettingsProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsComponent: React.FC<SettingsProps> = ({ settings, setSettings }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setSettings({ ...settings, [id]: checked });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, repeatSet: Number(e.target.value) });
  };

  return (
    <div className="mt-6">
      <Accordion title="Settings" defaultOpen={true}>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-slate-700">Shuffle Questions</span>
            <input
              id="shuffle"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={settings.shuffle}
              onChange={handleCheckboxChange}
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-slate-700">Repeat Wrong Answers</span>
            <input
              id="repeatWrong"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={settings.repeatWrong}
              onChange={handleCheckboxChange}
            />
          </label>
           <label className="flex items-center justify-between cursor-pointer">
            <span className="font-medium text-slate-700">Custom Numpad (recommended)</span>
            <input
              id="useCustomNumpad"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={settings.useCustomNumpad}
              onChange={handleCheckboxChange}
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Question Set Repetitions</span>
            <select
              id="repeatSet"
              value={settings.repeatSet}
              onChange={handleSelectChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} ×</option>
              ))}
            </select>
          </label>
        </div>
      </Accordion>
    </div>
  );
};

export default SettingsComponent;