import { React } from 'react';

const ChessBoard = (    ) => {

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="grid grid-cols-8 grid-rows-8 gap-0 shrink-0">
                {
                [...Array(64)].map((_, i) =>
                    {
                        const isDark = (Math.floor(i / 8) + (i % 8)) % 2 === 0;
                        return (
                            <div
                                key={i}
                                className={`${isDark ? 'bg-sky-200' : 'bg-slate-100'} w-24 h-24`}
                            ></div>
                        )
                    }

                )}
            </div>
        </div>
    )
}

export default ChessBoard;
