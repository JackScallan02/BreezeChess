import React, { useState, useEffect, useRef } from 'react';
// (Keep your existing imports)
import useDarkMode from '../darkmode/useDarkMode';
import StockfishWorker from '../stockfish/stockfish.js?worker';


// Define the props the component will accept
interface EvalBarProps {
  fen: string;
  height: number; // The height of the chessboard, in pixels
  scale: number;  // The scaling factor based on the board size
}

const EvalBar: React.FC<EvalBarProps> = ({ fen, height, scale }) => {
  const [evaluation, setEvaluation] = useState<number>(0);
  const [evalText, setEvalText] = useState<string>('+0.00');
  const isDarkMode = useDarkMode();
  const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
    workerRef.current = new StockfishWorker();
    const worker = workerRef.current;

    const handleStockfishMessage = (event: MessageEvent) => {
      const message: string = event.data;
      const perspective = fen.split(' ')[1] === 'w' ? 1 : -1;

      const mateMatch = message.match(/score mate (-?\d+)/);
      const cpMatch = message.match(/score cp (-?\d+)/);

      if (mateMatch) {
        const mateInMoves = parseInt(mateMatch[1], 10);
        const finalEvalPerspective = mateInMoves * perspective;

        setEvalText(`M${Math.abs(mateInMoves)}`);
        setEvaluation(finalEvalPerspective > 0 ? 10000 : -10000);

      } else if (cpMatch) {
        const scoreInCentipawns = parseInt(cpMatch[1], 10);
        const finalEvalPerspective = scoreInCentipawns * perspective;

        setEvaluation(finalEvalPerspective);

        const scoreInPawns = (finalEvalPerspective / 100).toFixed(2);
        const scorePrefix = finalEvalPerspective > 0 ? '+' : '';
        setEvalText(`${scorePrefix}${scoreInPawns}`);
      }
    };
    
    worker.addEventListener('message', handleStockfishMessage);
    worker.postMessage('uci');
    worker.postMessage('isready');

    return () => {
      worker.removeEventListener('message', handleStockfishMessage);
      worker.postMessage('quit');
      worker.terminate();
    };
  }, []); 
  
    useEffect(() => {
    if (workerRef.current) {
      setEvalText('+0.00');
      setEvaluation(0);
      workerRef.current.postMessage('stop');
      workerRef.current.postMessage(`position fen ${fen}`);
      workerRef.current.postMessage(`go depth 15`);
    }
  }, [fen]);


  // --- UI Rendering Logic (Updated for proportionality) ---
  const maxEval = 1000;
  const normalizedScore = Math.max(-maxEval, Math.min(maxEval, evaluation));
  const whiteHeight = (50 + (normalizedScore / maxEval) * 50).toFixed(2);

  // Calculate proportional styles based on props
  const barWidth = Math.max(10, scale * 16); // e.g., 16px at scale 1, with a min of 10px
  const fontSize = Math.max(6, scale * 10); // e.g., 10px at scale 1, with a min of 6px
  const marginTop = Math.max(8, scale * 16);
  const borderRadius = Math.max(2, scale * 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${barWidth * 1.5}px` }}>
      {/* The bar container's height is now controlled by the prop */}
      <div style={{
        height: `${height}px`, // Directly use the passed height
        width: `${barWidth}px`,
        border: '1px solid #404040',
        borderRadius: `${borderRadius}px`,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#404040',
        overflow: 'hidden'
      }}>
        {/* The white part of the bar grows from the bottom up */}
        <div className="white-bar" style={{ marginTop: 'auto', height: `${whiteHeight}%`, backgroundColor: 'white', transition: 'height 0.3s ease' }}></div>
      </div>
      
      {/* The text display */}
      <div style={{ 
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold', 
        fontFamily: 'sans-serif',
        textAlign: 'center',
        textWrap: 'nowrap',
        fontSize: `${fontSize}px`,
        marginTop: `${marginTop}px`,
      }}>
        {evalText}
      </div>
    </div>
  );
};

export default EvalBar;