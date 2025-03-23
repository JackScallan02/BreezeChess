import React from 'react';

const LoadingScreen = () => {
    
  return (
    <>
      <div className="flex flex-col min-h-screen dark:from-gray-800 dark:to-gray-900">
        <div className="flex grow">
          <div className="w-full flex items-center justify-center from-gray-200:to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <p className="dark:text-white">Loading...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
