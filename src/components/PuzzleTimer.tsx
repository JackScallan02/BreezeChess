// PuzzleTimer.tsx
import { useState, useEffect, useRef } from 'react';

interface PuzzleTimerProps {
    running: boolean;
    fontSize: number;
}

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const PuzzleTimer: React.FC<PuzzleTimerProps> = ({ running, fontSize }) => {
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [running]);

    return (
        <div className={`text-[${parseInt(fontSize.toString())}rem] font-mono`}>
            {formatTime(timer)}
        </div>
    );
};

export default PuzzleTimer;
