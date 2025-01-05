import { React } from 'react';
import MainToolBar from './components/MainToolBar';

const App = () => {
    
  return (
    <>
      <div className="w-full h-full absolute bg-gradient-to-r from-sky-400 to-blue-400">
        <MainToolBar />
      </div>
    </>
  );
}

export default App;
