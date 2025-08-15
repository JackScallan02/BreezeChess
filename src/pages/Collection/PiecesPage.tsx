import SelectedItemMenu from './SelectedItemMenu';
import { useState } from 'react';
import { Piece } from '../../types/Piece';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserInfo } from '../../api/users';
import { useUserData } from '../../contexts/UserDataContext';

interface PiecesPageProps {
    allPieces: Array<Piece>;
}

const PiecesPage: React.FC<PiecesPageProps> = ({ allPieces }) => {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const { user } = useAuth();
    const { selectedPieces, setUserDataField } = useUserData();
    const handleClick = (src: string) => {
        setSelectedImg(prev => (prev === src ? null : src)); // toggle
    };

    const handleEquip = async (piece: Piece) => {
        try {
            if (user) {
                // Create a new object for selectedPieces to trigger a re-render
                const newSelectedPieces = {
                    ...selectedPieces,
                    [piece.color]: {
                        ...selectedPieces[piece.color],
                        [piece.type]: piece.piece_id,
                    },
                };

                await updateUserInfo(user.id, { selected_pieces: newSelectedPieces });
                setUserDataField("selectedPieces", newSelectedPieces); // triggers re-render and useEffect
            }
        } catch (error) {
            console.error("Failed to update the board:", error);
        }
    };

    return (
        <div className="w-full flex flex-row flex-wrap gap-2 dark:bg-slate-600 bg-gray-300 p-4 rounded-lg">
            {allPieces.map((piece) => (
                <div
                    key={piece.signed_url}
                    className={`flex flex-col lg:min-h-30 lg:w-30 min-h-20 w-20 items-center
                        justify-between gap-3`}
                >
                    <div className={`rounded-md border-2 p-2 transition-all duration-200 cursor-pointer
                        ${selectedImg === piece.signed_url ? 'dark:border-gray-400 border-gray-500'
                            : 'border-transparent hover:border-gray-400 dark:hover:border-gray-500'}`}
                        onClick={() => handleClick(piece.signed_url)}

                    >
                        <img
                            src={piece.signed_url}
                            className="h-auto w-full rounded-sm object-contain select-none"
                            draggable={false}
                        />
                        {selectedImg === piece.signed_url && (
                            <SelectedItemMenu onEquipFn={() => { handleEquip(piece); }} onDetailsFn={() => { }} index={-1} equipped={(Object.values(selectedPieces).flatMap(colorObj => Object.values(colorObj))).includes(piece.piece_id)} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PiecesPage;