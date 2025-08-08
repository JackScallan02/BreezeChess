import React, { useState, useEffect } from 'react';

import { DisplayedPieces, PieceCode } from '../types/Piece';

const ProfilePieceDisplay = () => {

    const [displayedPieces, setDisplayedPieces] = useState<DisplayedPieces>({
        white: { p: '', r: '', n: '', b: '', q: '', k: '' },
        black: { p: '', r: '', n: '', b: '', q: '', k: '' },
    });

    useEffect(() => {
        setDisplayedPieces({
            black: {
                b: '/assets/chess_pieces/default/b/b.png',
                k: '/assets/chess_pieces/default/b/k.png',
                n: '/assets/chess_pieces/default/b/n.png',
                p: '/assets/chess_pieces/default/b/p.png',
                q: '/assets/chess_pieces/default/b/q.png',
                r: '/assets/chess_pieces/default/b/r.png'
            },
            white: {
                b: '/assets/chess_pieces/default/w/b.png',
                k: '/assets/chess_pieces/default/w/k.png',
                n: '/assets/chess_pieces/default/w/n.png',
                p: '/assets/chess_pieces/default/w/p.png',
                q: '/assets/chess_pieces/default/w/q.png',
                r: '/assets/chess_pieces/default/w/r.png'
            }
        });
    }, []);

    return (
        <div className={`rounded-lg p-4 bg-white dark:bg-slate-800 shadow-md border mt-16 w-full`}>
            <div className="w-full flex flex-col justify-center mt-8">
                <div className="w-full flex justify-center">
                    <p className="text-[2rem] font-medium">Display</p>
                </div>
                <div className="flex flex-row justify-between items-center mt-8">
                        <div className="flex flex-col gap-y-8 w-full">
                            <div
                                className={`
                                                flex flex-row flex-wrap
                                                gap-y-4
                                                justify-evenly
                                                items-end
                                                w-full
                                            `}
                            >
                                {(['p', 'r', 'k', 'q', 'b', 'n'] as PieceCode[]).map((piece) => (
                                    <img
                                        key={piece}
                                        src={displayedPieces.white[piece] || undefined}
                                        alt={`White ${piece}`}
                                        draggable={false}
                                        className="select-none lg:h-30 md:h-20 h-15 transition-all object-scale-down"
                                    />
                                ))}
                            </div>
                            <div
                                className={`
                                                flex flex-row flex-wrap
                                                gap-y-4
                                                justify-evenly
                                                items-end
                                                w-full
                                            `}
                            >
                                {(['p', 'r', 'k', 'q', 'b', 'n'] as PieceCode[]).map((piece) => (
                                    <img
                                        key={piece}
                                        src={displayedPieces.black[piece] || undefined}
                                        alt={`Black ${piece}`}
                                        draggable={false}
                                        className="select-none lg:h-30 md:h-20 h-15 transition-all object-scale-down"
                                    />
                                ))}
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
};

export default ProfilePieceDisplay;