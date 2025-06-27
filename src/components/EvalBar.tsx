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
  const latestEvalRef = useRef<{ type: 'cp' | 'mate'; value: number } | null>(null);
  const turnRef = useRef<'w' | 'b'>('w');
  const debounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new StockfishWorker();
      workerRef.current.postMessage('uci');
      workerRef.current.postMessage('isready');
      workerRef.current.postMessage('setoption name Contempt value 0');
      workerRef.current.postMessage('setoption name UCI_AnalyseMode value true');
    }

    const worker = workerRef.current;

    const handleStockfishMessage = (event: MessageEvent) => {
      const message: string = event.data;

      if (message.startsWith('info') && message.includes('score')) {
        const perspectiveMultiplier = turnRef.current === 'w' ? 1 : -1;

        const mateMatch = message.match(/score mate (-?\d+)/);
        const cpMatch = message.match(/score cp (-?\d+)/);

        if (mateMatch) {
          const mate = parseInt(mateMatch[1], 10);
          latestEvalRef.current = { type: 'mate', value: mate * perspectiveMultiplier };
        } else if (cpMatch) {
          const cp = parseInt(cpMatch[1], 10);
          latestEvalRef.current = { type: 'cp', value: cp * perspectiveMultiplier };
        }
      }

      if (message.startsWith('bestmove')) {
        const result = latestEvalRef.current;
        if (!result) return;

        if (result.type === 'mate') {
          setEvaluation(result.value > 0 ? 10000 : -10000);
          setEvalText(`M${Math.abs(result.value)}`);
        } else if (result.type === 'cp') {
          setEvaluation(result.value);
          const pawns = (result.value / 100).toFixed(2);
          setEvalText(`${result.value >= 0 ? '+' : ''}${pawns}`);
        }

        latestEvalRef.current = null;
      }
    };

    worker.addEventListener('message', handleStockfishMessage);

    // Debounce FEN evaluation
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      const turn = fen.split(' ')[1] as 'w' | 'b';
      turnRef.current = turn;

      latestEvalRef.current = null;

      worker.postMessage('stop');
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage('go movetime 1000');
    }, 100);

    return () => {
      worker.removeEventListener('message', handleStockfishMessage);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      worker.postMessage('stop');
    };
  }, [fen]);

  // --- UI ---
  const maxEval = 1000;
  const normalizedScore = Math.max(-maxEval, Math.min(maxEval, evaluation));
  const whiteHeight = 50 + (normalizedScore / maxEval) * 50;
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
