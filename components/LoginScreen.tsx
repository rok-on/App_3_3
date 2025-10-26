import React, { useState, useEffect, useCallback } from 'react';
import { USERS } from '../constants';
import type { User } from '../types';

interface LoginScreenProps {
  onSuccess: () => void;
}

const LOGIN_TIME_LIMIT = 3000;

//- Fix: Changed return type from JSX.Element to React.ReactElement to resolve JSX namespace error.
export default function LoginScreen({ onSuccess }: LoginScreenProps): React.ReactElement {
  const [clickedUsers, setClickedUsers] = useState<Set<User>>(new Set());
  const [message, setMessage] = useState<string>('Pripravljeni?');
  const [isFailing, setIsFailing] = useState<boolean>(false);

  const handleUserClick = (user: User) => {
    if (clickedUsers.has(user)) return;
    const newClickedUsers = new Set(clickedUsers);
    newClickedUsers.add(user);
    setClickedUsers(newClickedUsers);
  };

  const reset = useCallback(() => {
    setIsFailing(true);
    setMessage('Napaka. Poskusite znova.');
    setTimeout(() => {
      setClickedUsers(new Set());
      setMessage('Pripravljeni?');
      setIsFailing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (isFailing) return;

    if (clickedUsers.size === USERS.length) {
      onSuccess();
      return;
    }

    const timer = setTimeout(() => {
      if (clickedUsers.size < USERS.length) {
        reset();
      }
    }, LOGIN_TIME_LIMIT);

    return () => clearTimeout(timer);
  }, [clickedUsers, onSuccess, reset, isFailing]);

  return (
    <div className="flex flex-col items-center justify-center w-full animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-6">{message}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl">
        {USERS.map((user) => (
          <button
            key={user}
            onClick={() => handleUserClick(user)}
            disabled={clickedUsers.has(user) || isFailing}
            className={`p-4 md:p-6 text-xl md:text-2xl font-bold rounded-lg shadow-lg transition-all duration-300 transform 
            ${clickedUsers.has(user)
                ? 'bg-green-600 text-white scale-105 shadow-green-500/50'
                : 'bg-purple-800 hover:bg-purple-700 hover:scale-105'
            }
            ${isFailing ? 'bg-red-800 animate-pulse' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  );
}