import React, { useState, useEffect, useCallback } from 'react';
import { USERS, TASK_ONE_ANSWERS } from '../constants';
import type { User } from '../types';
import UserPanel from './shared/UserPanel';

interface TaskOneScreenProps {
  onSuccess: () => void;
  onFailure: () => void;
}

const TASK_ONE_TIME_LIMIT = 5000;

//- Fix: Changed return type from JSX.Element to React.ReactElement to resolve JSX namespace error.
export default function TaskOneScreen({ onSuccess, onFailure }: TaskOneScreenProps): React.ReactElement {
  const [userInputs, setUserInputs] = useState<Map<User, number>>(new Map());
  const [timeLeft, setTimeLeft] = useState(TASK_ONE_TIME_LIMIT / 1000);

  const handleNumberClick = (user: User, number: number) => {
    if (userInputs.has(user)) return;
    const newInputs = new Map(userInputs);
    newInputs.set(user, number);
    setUserInputs(newInputs);
  };

  const checkAnswers = useCallback(() => {
    if (userInputs.size < USERS.length) return;

    let allCorrect = true;
    for (const user of USERS) {
      if (userInputs.get(user) !== TASK_ONE_ANSWERS[user]) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      onSuccess();
    } else {
      onFailure();
    }
  }, [userInputs, onSuccess, onFailure]);

  useEffect(() => {
    if (userInputs.size === USERS.length) {
      checkAnswers();
    }
  }, [userInputs, checkAnswers]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onFailure();
    }, TASK_ONE_TIME_LIMIT);

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fadeIn">
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-purple-400">Kdo ima največ črk?</h2>
        <p className="text-lg md:text-xl text-orange-300">Uredite se po številu črk v imenu (od največ do najmanj) in izberite pravo številko.</p>
        <p className="text-2xl font-creepster text-red-500 animate-pulse mt-2">Čas: {timeLeft}s</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {USERS.map(user => (
          <UserPanel key={user} user={user} isSelected={userInputs.has(user)} >
             <div className="grid grid-cols-3 gap-2 mt-4">
               {[1, 2, 3].map(num => (
                 <button 
                   key={num}
                   onClick={() => handleNumberClick(user, num)}
                   disabled={userInputs.has(user)}
                   className={`p-3 text-lg font-bold rounded-md transition-colors ${
                     userInputs.get(user) === num 
                       ? 'bg-green-600' 
                       : 'bg-slate-700 hover:bg-slate-600'
                   } disabled:opacity-50 disabled:hover:bg-slate-700`}
                 >
                   {num}
                 </button>
               ))}
             </div>
          </UserPanel>
        ))}
      </div>
    </div>
  );
}
