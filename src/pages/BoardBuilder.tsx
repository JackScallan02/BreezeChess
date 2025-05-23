import React from 'react';
import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';
import ChessBoard from '../components/ChessBoard';
import { useNavigation } from '../navigator/navigate';

const BoardBuilder = () => {

    const { handleNavigation } = useNavigation();

    useDarkMode();

    return (
<div className="flex flex-col min-h-screen w-full overflow-hidden">
  <div className="h-16 shrink-0">
    <MainToolBar />
  </div>

  <main className="flex-1 w-full overflow-hidden">
    <ChessBoard showLabels />
  </main>
</div>


  );
};

export default BoardBuilder;
