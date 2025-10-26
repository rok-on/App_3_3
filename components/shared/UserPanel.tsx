
import React from 'react';
import type { User } from '../../types';

interface UserPanelProps {
  user: User;
  children: React.ReactNode;
  isSelected?: boolean;
}

//- Fix: Changed return type from JSX.Element to React.ReactElement to resolve JSX namespace error.
export default function UserPanel({ user, children, isSelected = false }: UserPanelProps): React.ReactElement {
  return (
    <div 
      className={`p-4 border-2 rounded-lg transition-all duration-300 ${isSelected ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20' : 'border-purple-800 bg-slate-900/50'}`}
    >
      <h3 className={`text-center text-xl font-bold ${isSelected ? 'text-orange-400' : 'text-purple-300'}`}>
        {user}
      </h3>
      {children}
    </div>
  );
}