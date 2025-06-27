import React, { useState, useEffect, useRef } from 'react';
import useDarkMode from '../darkmode/useDarkMode';
import StockfishWorker from '../stockfish/stockfish.js?worker';

interface EvalBarProps {
  fen: string;
  height: number;
  scale: number;
}

const EvalBar: React.FC<EvalBarProps> = ({ fen, height, scale }) => {
  const [evaluation, setEvaluation] = useState<number>(0);
  const [evalText, setEvalText] = useState<string>('+0.00');
  const isDarkMode = useDarkMode();
  const workerRef = useRef<Worker | null>(null);
  const lastRequestedFenRef = useRef<string | null>(null);
  const currentFenTurnRef = useRef<'w' | 'b' | null>(null); // To store the turn of the last requested FEN
  const debounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize worker if not already done
    if (!workerRef.current) {
      workerRef.current = new StockfishWorker();
      workerRef.current.postMessage('uci');
      workerRef.current.postMessage('isready');
    }
    
    const worker = workerRef.current;

    const handleStockfishMessage = (event: MessageEvent) => {
      const message: string = event.data;
      if (!message.startsWith('info')) return;

      const expectedTurn = currentFenTurnRef.current;
      if (!expectedTurn) {
          // If we haven't requested a FEN yet, or it's been cleared, ignore messages
          return;
      }

      // Calculate perspective based *only* on the turn of the FEN we requested
      const perspective = expectedTurn === 'w' ? 1 : -1;

      const mateMatch = message.match(/score mate (-?\d+)/);
      const cpMatch = message.match(/score cp (-?\d+)/);
      
      if (mateMatch) {
        const mateInMoves = parseInt(mateMatch[1], 10);
        // Mate scores are usually absolute, but applying perspective makes it consistent
        // Mates are also usually not affected by the "flip" issue as much as CP
        const absoluteEval = mateInMoves * perspective; 
        setEvaluation(absoluteEval > 0 ? 10000 : -10000);
        setEvalText(`M${Math.abs(mateInMoves)}`);
      } else if (cpMatch) {
        const scoreFromEngine = parseInt(cpMatch[1], 10);
        
        // Stockfish reports score relative to the side *to move* in the FEN it's evaluating.
        // We want the score always from White's perspective.
        const scoreForWhitesPerspective = scoreFromEngine * perspective;

        // Small sanity check
        if (Math.abs(scoreFromEngine) > 1000 && !mateMatch) { // Example: ignore very high CP scores if not mate
          return; 
        }

        const scoreInPawns = (scoreForWhitesPerspective / 100).toFixed(2);
        
        setEvaluation(scoreForWhitesPerspective);
        setEvalText(`${scoreForWhitesPerspective >= 0 ? '+' : ''}${scoreInPawns}`);
      }
    };

    worker.addEventListener('message', handleStockfishMessage);

    // Debounce the Stockfish commands
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      // Set the FEN and its turn *after* the debounce, just before sending to Stockfish
      lastRequestedFenRef.current = fen;
      currentFenTurnRef.current = fen.split(' ')[1] as 'w' | 'b';

      worker.postMessage('stop');
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage('go movetime 3000');
    }, 100); // Keep debounce time at 100ms for now, can adjust if needed

    return () => {
      worker.removeEventListener('message', handleStockfishMessage);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      // Stop the worker explicitly on cleanup to prevent lingering evaluations
      // if the component unmounts or FEN changes rapidly.
      worker.postMessage('stop'); 
      lastRequestedFenRef.current = null;
      currentFenTurnRef.current = null;
    };

  }, [fen]); // Effect depends only on `fen`

  // --- UI Rendering Logic (No changes needed) ---
  const maxEval = 1000;
  const normalizedScore = Math.max(-maxEval, Math.min(maxEval, evaluation));
  const whiteHeight = (50 + (normalizedScore / maxEval) * 50);
  const barWidth = Math.max(10, scale * 16);
  const fontSize = Math.max(8, scale * 12);
  const marginTop = Math.max(8, scale * 16);
  const borderRadius = Math.max(2, scale * 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${barWidth * 1.5}px` }}>
      <div style={{
        height: `${height}px`,
        width: `${barWidth}px`,
        border: '1px solid #404040',
        borderRadius: `${borderRadius}px`,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#404040',
        overflow: 'hidden'
      }}>
        <div className="white-bar" style={{ 
            marginTop: 'auto', 
            height: `${whiteHeight}%`, 
            backgroundColor: 'white', 
            transition: 'height 0.3s ease-in-out'
        }}></div>
      </div>
      <div style={{ 
        color: isDarkMode ? 'white' : 'black',
        fontWeight: 'bold', 
        fontFamily: 'sans-serif',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        fontSize: `${fontSize}px`,
        marginTop: `${marginTop}px`,
      }}>
        {evalText}
      </div>
    </div>
  );
};

export default EvalBar;