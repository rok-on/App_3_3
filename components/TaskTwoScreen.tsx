
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { USERS, TASK_TWO_ROUNDS } from '../constants';
import { ArrowDirection } from '../types';
import type { User } from '../types';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from './icons/ArrowIcons';
import UserPanel from './shared/UserPanel';

interface TaskTwoScreenProps {
  onSuccess: () => void;
  onFailure: () => void;
  currentUser: User;
}

const DIRECTIONS = Object.values(ArrowDirection);
const ROUND_TIME_LIMIT = 5000;
const DELAY_BETWEEN_ROUNDS = 3000;

//- Fix: Changed return type from JSX.Element to React.ReactElement to resolve JSX namespace error.
export default function TaskTwoScreen({ onSuccess, onFailure, currentUser }: TaskTwoScreenProps): React.ReactElement {
  const [round, setRound] = useState(1);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [targetDirection, setTargetDirection] = useState<ArrowDirection | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextRound = useCallback(() => {
    if (round > TASK_TWO_ROUNDS) {
      onSuccess();
      return;
    }

    const newTargetUser = USERS[Math.floor(Math.random() * USERS.length)];
    const newTargetDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

    setTargetUser(newTargetUser);
    setTargetDirection(newTargetDirection);

    timeoutRef.current = setTimeout(() => {
        onFailure();
    }, ROUND_TIME_LIMIT);
  }, [round, onFailure, onSuccess]);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
        nextRound();
    }, round === 1 ? 0 : DELAY_BETWEEN_ROUNDS);

    return () => clearTimeout(delayTimer);
  }, [round, nextRound]);

  const handleArrowClick = (clickedUser: User, direction: ArrowDirection) => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }

    if (clickedUser === targetUser && direction === targetDirection) {
        setTargetUser(null);
        setTargetDirection(null);
        setRound(prev => prev + 1);
    } else {
        onFailure();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fadeIn">
       <div className="mb-4 text-center">
         <h2 className="text-xl md:text-2xl font-bold text-purple-400">Hitra reakcija! ({round}/{TASK_TWO_ROUNDS})</h2>
         {targetUser && targetDirection && (
             <p className="text-2xl md:text-4xl text-orange-400 font-bold animate-pulse h-12">
                 {targetUser} {targetDirection}
             </p>
         )}
         {!targetUser && round <= TASK_TWO_ROUNDS && (
            <p className="text-2xl md:text-4xl text-gray-400 h-12">Pripravi se...</p>
         )}
       </div>
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        {USERS.map(user => (
          <UserPanel key={user} user={user} isSelected={user === targetUser}>
             {user === currentUser ? (
                <div className="grid grid-cols-3 grid-rows-2 gap-2 mt-4">
                    <div />
                    <button onClick={() => handleArrowClick(user, ArrowDirection.Up)} className="p-2 bg-slate-700 rounded hover:bg-slate-600"><ArrowUp /></button>
                    <div />
                    <button onClick={() => handleArrowClick(user, ArrowDirection.Left)} className="p-2 bg-slate-700 rounded hover:bg-slate-600"><ArrowLeft /></button>
                    <button onClick={() => handleArrowClick(user, ArrowDirection.Down)} className="p-2 bg-slate-700 rounded hover:bg-slate-600"><ArrowDown /></button>
                    <button onClick={() => handleArrowClick(user, ArrowDirection.Right)} className="p-2 bg-slate-700 rounded hover:bg-slate-600"><ArrowRight /></button>
                </div>
             ) : (
                <div className="mt-4 flex items-center justify-center h-[88px] text-slate-500">
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
