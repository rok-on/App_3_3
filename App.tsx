
import React, { useState, useCallback } from 'react';
import { GameState, User } from './types';
import LoginScreen from './components/LoginScreen';
import TaskOneScreen from './components/TaskOneScreen';
import TaskTwoScreen from './components/TaskTwoScreen';
import EndScreen from './components/EndScreen';
import { USERS } from './constants';

//- Fix: Changed return type from JSX.Element to React.ReactElement to resolve JSX namespace error.
export default function App(): React.ReactElement {
  const [gameState, setGameState] = useState<GameState>(GameState.Login);
  const [failureMessage, setFailureMessage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLoginSuccess = useCallback(() => {
    setGameState(GameState.TaskOne);
  }, []);

  const handleTaskOneSuccess = useCallback(() => {
    setGameState(GameState.TaskTwo);
  }, []);

  const handleTaskTwoSuccess = useCallback(() => {
    setGameState(GameState.Success);
  }, []);

  const handleFailure = useCallback((message: string) => {
    setFailureMessage(message);
    setGameState(GameState.Failure);
  }, []);
  
  const handleRestart = useCallback(() => {
    setFailureMessage('');
    setGameState(GameState.Login);
  }, []);

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
  };

  const renderGame = () => {
    switch (gameState) {
      case GameState.Login:
        return <LoginScreen onSuccess={handleLoginSuccess} />;
      case GameState.TaskOne:
        return <TaskOneScreen onSuccess={handleTaskOneSuccess} onFailure={() => handleFailure('Napaka!')} currentUser={currentUser!} />;
      case GameState.TaskTwo:
        return <TaskTwoScreen onSuccess={handleTaskTwoSuccess} onFailure={() => handleFailure('Napaka!')} currentUser={currentUser!} />;
      case GameState.Success:
        return <EndScreen message="Dobro sudelujete." onRestart={handleRestart} isSuccess={true} />;
      case GameState.Failure:
        return <EndScreen message={failureMessage} onRestart={handleRestart} isSuccess={false} />;
      default:
        return <LoginScreen onSuccess={handleLoginSuccess} />;
    }
  };

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-orange-100">
        <div className="w-full max-w-7xl mx-auto text-center">
          <h1 className="text-7xl md:text-9xl font-creepster text-orange-500 tracking-wider">Halloween</h1>
          <p className="text-xl md:text-2xl text-purple-300 mt-2 mb-8">Naloga 3. Sodelovanje</p>
          <div className="bg-slate-800/50 border border-purple-800 rounded-2xl shadow-2xl shadow-purple-900/50 p-4 md:p-8 min-h-[50vh] flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-purple-400 mb-6">Kdo si ti?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl">
              {USERS.map((user) => (
                <button
                  key={user}
                  onClick={() => handleSelectUser(user)}
                  className="p-4 md:p-6 text-xl md:text-2xl font-bold rounded-lg shadow-lg transition-all duration-300 transform bg-purple-800 hover:bg-purple-700 hover:scale-105"
                >
                  {user}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-orange-100">
      <div className="w-full max-w-7xl mx-auto text-center">
        <h1 className="text-7xl md:text-9xl font-creepster text-orange-500 tracking-wider">Halloween</h1>
        <p className="text-xl md:text-2xl text-purple-300 mt-2 mb-8">Naloga 3. Sodelovanje</p>
        <div className="bg-slate-800/50 border border-purple-800 rounded-2xl shadow-2xl shadow-purple-900/50 p-4 md:p-8 min-h-[50vh] flex items-center justify-center">
          {renderGame()}
        </div>
      </div>
    </main>
  );
}
