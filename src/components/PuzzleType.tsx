import React, { useState, useEffect, useRef } from "react";
import PuzzleBoard from '../pages/PuzzleBoard';
import { getPuzzles } from "../api/puzzles";
import MainToolBar from "./MainToolBar";

interface PuzzleProps {
    title: string;
    themes: Array<string>;
};

const PuzzleType: React.FC<PuzzleProps> = ({ title, themes }) => {
    const hasFetched = useRef(false); // <-- guard ref
    const [puzzleSolution, setPuzzleSolution] = useState({
        fen: '',
        moves: [''],
        name: '',
        fetchPuzzle: () => {},
    });

    const fetchPuzzle = async () => {
        try {
            const res = await getPuzzles({ themes: themes }, undefined);
            const puzzle = res.result[0];
            const moveList = puzzle.Moves.split(' ');
            setPuzzleSolution({
                fen: puzzle.FEN,
                moves: moveList,
                name: title,
                fetchPuzzle: fetchPuzzle,
            });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchPuzzle();
        }
    }, []);
return (
  <div className="flex flex-col h-screen w-full">
    <MainToolBar />
    <div className="flex-1 overflow-y-scroll min-h-0 no-scrollbar">
      {puzzleSolution?.fen && (
        <PuzzleBoard puzzleSolution={puzzleSolution} fetchPuzzle={fetchPuzzle} />
      )}
    </div>
  </div>
);

};

export default PuzzleType;