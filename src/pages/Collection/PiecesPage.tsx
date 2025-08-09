import SelectedItemMenu from './SelectedItemMenu';
import { useState } from 'react';
import { Piece } from '../../types/Piece';

interface PiecesPageProps {
    allPieces: Array<Piece>;
}

const PiecesPage: React.FC<PiecesPageProps> = ({ allPieces }) => {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const handleClick = (src: string) => {
        setSelectedImg(prev => (prev === src ? null : src)); // toggle
    };
    return (
        <div className="w-full flex flex-row flex-wrap gap-2 dark:bg-slate-600 bg-gray-300 p-4 rounded-lg">
            {allPieces.map((piece) => (
                <div
                    key={piece.src}
                    className={`flex flex-col lg:min-h-30 lg:w-30 min-h-20 w-20 items-center
                        justify-between gap-3`}
                >
                    <div className={`rounded-md border-2 p-2 transition-all duration-200 cursor-pointer
                        ${selectedImg === piece.src ? 'dark:border-gray-400 border-gray-500'
                            : 'border-transparent hover:border-gray-400 dark:hover:border-gray-500'}`}
                        onClick={() => handleClick(piece.src)}

                    >
                        <img
                            src={piece.src}
                            className="h-auto w-full rounded-sm object-contain select-none"
                            draggable={false}
                        />
                        {selectedImg === piece.src && (
                            <SelectedItemMenu onEquipFn={() => { }} onDetailsFn={() => {}} index={-1} equipped={-1} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PiecesPage;