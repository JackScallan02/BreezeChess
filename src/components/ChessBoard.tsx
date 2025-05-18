import React, { useRef, useEffect, useState } from "react";

interface props {
    showLabels: boolean;
}

const ChessBoard: React.FC<props> = ({ showLabels }) => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const boardRef = useRef<HTMLDivElement>(null);
    const [boardWidth, setBoardWidth] = useState(0);

    useEffect(() => {
        const updateBoardWidth = () => {
            if (boardRef.current) {
                setBoardWidth(boardRef.current.offsetWidth);
            }
        };

        updateBoardWidth();
        window.addEventListener("resize", updateBoardWidth);

        return () => {
            window.removeEventListener("resize", updateBoardWidth);
        };
    }, []);

    const sideLabelWidth = boardWidth * 0.04; // Adjust the 0.04 factor as needed
    const bottomLabelMarginTop = boardWidth * 0.02; // Adjust the 0.02 factor as needed

    return (
        <div
            className="flex justify-center items-center w-full h-full text-black dark:text-white overflow-hidden"
            style={{
                padding: "2rem",
                boxSizing: "border-box",
            }}
        >
            <img src="/assets/chess_pieces/default/white/rook.webp" />
            <div className="flex flex-col items-center" style={{ minHeight: "300px", minWidth: "300px" }}>
                <div className="flex">
                    {showLabels && (
                        <div
                            className="flex flex-col justify-between"
                            style={{
                                height: boardWidth,
                                minHeight: "300px",
                                marginRight: `min(${sideLabelWidth}px, 12px)`,
                            }}
                        >
                            {numbers.map((num, i) => (
                                <div
                                    key={i}
                                    className="flex-1 flex items-center justify-center text-sm"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    )}
                    <div
                        ref={boardRef}
                        className="grid grid-cols-8 grid-rows-8
                   max-w-full max-h-full
                   min-w-[300px] min-h-[300px]"
                        style={{
                            width: "min(85vmin, calc(100vh - 4rem - 48px), calc(100vw - 4rem - 48px))",
                            height: "min(85vmin, calc(100vh - 4rem - 48px), calc(100vw - 4rem - 48px))",
                        }}
                    >
                        {[...Array(64)].map((_, i) => {
                            const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 0;
                            return (
                                <div
                                    key={i}
                                    className={`${isDark ? "bg-sky-200" : "bg-slate-100"}`}
                                />
                            );
                        })}
                    </div>
                </div>

                {showLabels && (
                    <div
                        className="grid grid-cols-8"
                        style={{
                            width: boardWidth,
                            marginLeft: `min(${sideLabelWidth}px, 12px)`,
                            minWidth: "300px",
                            marginTop: `min(${bottomLabelMarginTop}px, 6px)`,
                        }}
                    >
                        {letters.map((letter, i) => (
                            <div key={i} className="text-center text-sm">
                                {letter}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default ChessBoard;