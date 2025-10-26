import React, { useState, useEffect, useCallback, useRef } from 'react';
import { USERS, TASK_TWO_ROUNDS } from '../constants';
import { ArrowDirection } from '../types';
import type { User } from '../types';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from './icons/ArrowIcons';
import UserPanel from './shared/UserPanel';

interface TaskTwoScreenProps {
  onSuccess: () => void;
  onFailure: () => void;
}

const DIRECTIONS = Object.values(ArrowDirection);
const ROUND_TIME_LIMIT = 1000;
const DELAY_BETWEEN_ROUNDS = 1000;

//- Fix: Changed return type from JSX.Element to React.ReactElement to resolve JSX namespace error.
export default function TaskTwoScreen({ onSuccess, onFailure }: TaskTwoScreenProps): React.ReactElement {
  const [round, setRound] = useState(1);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [targetDirection, setTargetDirection] = useState<ArrowDirection | null>(null);
  const [progress, setProgress] = useState(0);

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
    setProgress(100);

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
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (targetUser) {
      interval = setInterval(() => {
        setProgress(p => Math.max(0, p - (100 / (ROUND_TIME_LIMIT / 100))));
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [targetUser]);


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
         <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4">
            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
        </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {USERS.map(user => (
          <UserPanel key={user} user={user} isSelected={user === targetUser}>
             <div className="grid grid-cols-3 grid-rows-2 gap-2 mt-4">
                <div />
                <button onClick={() => handleArrowClick(user, ArrowDirection.Up)} className="p-2 bg-slate-700 rounded hover:bg-slate-600"><ArrowUp /></button>
                <div />
                <button onClick={() => handleArrowClick(user, ArrowDirection.Left)} className="p-2 bg-slate-700 rounded hover:bg-slate-600"><ArrowLeft /></button>
                <button onClick={() => handleArrowClick(user, ArrowDirection.Down)} className="p-2 bg-slate-700 rounded hover:bg-slate-600"><ArrowDown /></button>
                <button onClick={() => handleArrowClick(user, ArrowDirection.Right)} className="p-2 bg-slate-700 rounded hover:bg-slate-600"><ArrowRight /></button>
             </div>
          </UserPanel>
        ))}
      </div>
    </div>
  );
}
