import React, { useState, useEffect, useRef } from "react";
import PuzzleBoard from '../pages/PuzzleBoard';
import { getPuzzles } from "../api/puzzles";
import MainToolBar from "./MainToolBar";

interface PuzzleProps {
    title: string;
    themes: Array<string>;
};

const PuzzleType: React.FC<PuzzleProps>  = ({title, themes}) => {
    const hasFetched = useRef(false); // <-- guard ref
    const [puzzleSolution, setPuzzleSolution] = useState({
        fen: '',
        moves: [''],
        name: '',
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
        <>
            <MainToolBar />
            {puzzleSolution  && puzzleSolution.fen && <PuzzleBoard puzzleSolution={puzzleSolution} fetchPuzzle={fetchPuzzle} />}
        </>
    );
};

export default PuzzleType;