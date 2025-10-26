
import React from 'react';

interface EndScreenProps {
  message: string;
  onRestart: () => void;
  isSuccess: boolean;
}

//- Fix: Changed return type from JSX.Element to React.ReactElement to resolve JSX namespace error.
export default function EndScreen({ message, onRestart, isSuccess }: EndScreenProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center text-center animate-fadeIn">
      <h2 className={`text-4xl md:text-6xl font-bold font-creepster tracking-wider ${isSuccess ? 'text-green-500' : 'text-red-600'}`}>
        {isSuccess ? 'Bravo!' : 'Napaka!'}
      </h2>
      <p className="text-xl md:text-2xl mt-4 mb-8 text-orange-200">{message}</p>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xl rounded-lg shadow-lg shadow-orange-700/50 transform hover:scale-105 transition-all"
      >
        {isSuccess ? 'Še enkrat!' : 'Poskusi znova'}
      </button>
    </div>
  );
}