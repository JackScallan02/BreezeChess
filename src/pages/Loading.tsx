import React from 'react';
import useDarkMode from '../darkmode/useDarkMode';

const LoadingScreen = () => {
  
  useDarkMode();
    
  return (
    <div className="min-h-screen min-w-screen flex justify-center">
      <p className="dark:text-white mt-24">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
