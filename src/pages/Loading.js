import { React } from 'react';

const LoadingScreen = () => {
    
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-grow">
          <div className="w-full flex items-center justify-center bg-gray-200">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
