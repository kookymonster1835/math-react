
import React from 'react';

interface CustomNumpadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
}

const NumpadButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, children, className = '' }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()} // Prevent input blur
    onClick={onClick}
    className={`flex-1 p-2 rounded-xl bg-slate-200 text-slate-800 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-600 active:text-white transition-colors duration-150 ${className}`}
  >
    {children}
  </button>
);

const CustomNumpad: React.FC<CustomNumpadProps> = ({ onKeyPress, onBackspace, onEnter }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4 rounded-t-2xl shadow-lg z-50 animate-fade-in-up">
      <div className="max-w-md mx-auto space-y-2">
        <div className="flex space-x-2">
          <NumpadButton onClick={() => onKeyPress('7')}>7</NumpadButton>
          <NumpadButton onClick={() => onKeyPress('8')}>8</NumpadButton>
          <NumpadButton onClick={() => onKeyPress('9')}>9</NumpadButton>
        </div>
        <div className="flex space-x-2">
          <NumpadButton onClick={() => onKeyPress('4')}>4</NumpadButton>
          <NumpadButton onClick={() => onKeyPress('5')}>5</NumpadButton>
          <NumpadButton onClick={() => onKeyPress('6')}>6</NumpadButton>
        </div>
        <div className="flex space-x-2">
          <NumpadButton onClick={() => onKeyPress('1')}>1</NumpadButton>
          <NumpadButton onClick={() => onKeyPress('2')}>2</NumpadButton>
          <NumpadButton onClick={() => onKeyPress('3')}>3</NumpadButton>
        </div>
        <div className="flex space-x-2">
          <NumpadButton onClick={() => onKeyPress('.')}>.</NumpadButton>
          <NumpadButton onClick={() => onKeyPress('0')}>0</NumpadButton>
          <NumpadButton onClick={onBackspace} className="text-xl bg-slate-300">⌫</NumpadButton>
        </div>
      </div>
    </div>
  );
};

export default CustomNumpad;
