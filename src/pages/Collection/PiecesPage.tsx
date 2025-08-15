import SelectedItemMenu from './SelectedItemMenu';
import { useState } from 'react';
import { Piece } from '../../types/Piece';
import { Rarity } from '../../types/rarity';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserInfo } from '../../api/users';
import { useUserData } from '../../contexts/UserDataContext';
import { formatDate } from '../../helpers/formatDate';

interface PieceDetailsModalProps {
    piece: Piece;
    setShowPieceDetailsModal: (show: boolean) => void;
}


const rarityMapping: Record<Rarity, string> = {
    "common": 'text-slate-200',
    "rare": 'text-blue-400',
    "ultra": 'text-indigo-600',
    "legendary": 'text-amber-500',
    "divine": 'text-fuchsia-500',
}

const PieceDetailsModal: React.FC<PieceDetailsModalProps> = ({ piece, setShowPieceDetailsModal }) => {
    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40"></div>

            {/* Modal */}
            <div
                id="default-modal"
                className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full"
            >
                <div className="relative p-4 w-full max-w-2xl">
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        {/* Modal Header */}
                        <div className="relative flex flex-col p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                            <div className="flex flex-col gap-y-2">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {piece.piece_name}
                                </h3>
                                <div>
                                    <p>
                                        <span className={`font-semibold text-sm dark:text-white text-black`}>Rarity: </span>
                                        <span className={`text-md ${rarityMapping[piece.rarity as Rarity]}`}>
                                            {piece.rarity}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm dark:text-white text-black">
                                        <span className="font-semibold">Date acquired:</span> {formatDate(piece.acquired_at || '')}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="absolute top-4 right-4 cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => {
                                    setShowPieceDetailsModal(false);
                                }} // Set state to close
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="w-full flex justify-center mt-8 sm:mt-4">
                            <div className="drop-shadow-[0_0px_20px_rgba(0,0,0,0.5)] rounded-md">
                                <div
                                    className={`w-25 h-25`}
                                >
                                    <img src={piece.signed_url} alt="piece" />
                                </div>
                            </div>
                        </div>


                        {/* Modal Body */}
                        <div className="p-4 md:p-5 space-y-4 flex justify-center">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                {piece.description}
                            </p>
                        </div>
                        {/* Modal Footer */}
                        <div className="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                            <>
                                <button
                                    type="button"
                                    className="cursor-pointer py-2.5 px-5 ms-3 text-sm font-medium
                                        text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200
                                        hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2
                                        focus:ring-gray-100 dark:focus:ring-blue-700 dark:bg-gray-700
                                        dark:text-gray-300 dark:border-gray-600 dark:hover:text-white
                                        dark:hover:bg-gray-700"
                                    onClick={() => {
                                        setShowPieceDetailsModal(false);
                                    }} // Set state to close
                                >
                                    Close
                                </button>
                            </>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


interface PiecesPageProps {
    allPieces: Array<Piece>;
}

const PiecesPage: React.FC<PiecesPageProps> = ({ allPieces }) => {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const { user } = useAuth();
    const { selectedPieces, setUserDataField } = useUserData();
    const [modalPiece, setModalPiece] = useState({});
    const [showPieceDetailsModal, setShowPieceDetailsModal] = useState(false);
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
            console.error("Failed to update the piece:", error);
        }
    };

    const handleDetails = (piece: Piece) => {
        setModalPiece(piece);
        setShowPieceDetailsModal(true);
    };

    return (
        <>
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
                                <SelectedItemMenu onEquipFn={() => { handleEquip(piece); }} onDetailsFn={() => { handleDetails(piece); }} index={-1} equipped={(Object.values(selectedPieces).flatMap(colorObj => Object.values(colorObj))).includes(piece.piece_id)} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {showPieceDetailsModal && modalPiece && (
                <PieceDetailsModal piece={modalPiece} setShowPieceDetailsModal={setShowPieceDetailsModal} />
            )}
        </>
    );
};

export default PiecesPage;