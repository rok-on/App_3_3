
import React, { useState, useEffect, useCallback } from 'react';
import { USERS, TASK_ONE_ANSWERS } from '../constants';
import type { User } from '../types';
import UserPanel from './shared/UserPanel';

interface TaskOneScreenProps {
  onSuccess: () => void;
  onFailure: () => void;
  currentUser: User;
}

const TASK_ONE_TIME_LIMIT = 3000;

//- Fix: Changed return type from JSX.Element to React.ReactElement to resolve JSX namespace error.
export default function TaskOneScreen({ onSuccess, onFailure, currentUser }: TaskOneScreenProps): React.ReactElement {
  const [userInputs, setUserInputs] = useState<Map<User, number>>(new Map());

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
      if (userInputs.size < USERS.length) {
        onFailure();
      }
    }, TASK_ONE_TIME_LIMIT);

    return () => {
      clearTimeout(timer);
    };
  }, [onFailure, userInputs.size]);

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fadeIn">
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-purple-400">Kdo ima največ črk?</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {USERS.map(user => (
          <UserPanel key={user} user={user} isSelected={userInputs.has(user)} >
             {user === currentUser ? (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[1, 2, 3, 4].map(num => (
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
             ) : (
                <div className="mt-4 flex items-center justify-center h-[96px] text-slate-500">
                  <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
             )}
          </UserPanel>
        ))}
      </div>
    </div>
  );
}
