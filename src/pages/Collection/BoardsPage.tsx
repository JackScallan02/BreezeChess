import { useState, useEffect } from 'react';
import { Board } from '../../types/board';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserInfo } from '../../api/users';
import SelectedItemMenu from './SelectedItemMenu';
import { formatDate } from '../../helpers/formatDate';
import { Rarity } from '../../types/rarity';

interface BoardDetailsModalProps {
    board: Board;
    setShowBoardDetailsModal: (show: boolean) => void;
}


const rarityMapping: Record<Rarity, string> = {
    "common": 'text-slate-200',
    "rare": 'text-blue-400',
    "ultra": 'text-indigo-600',
    "legendary": 'text-amber-500',
    "divine": 'text-fuchsia-500',
}

const BoardDetailsModal: React.FC<BoardDetailsModalProps> = ({ board, setShowBoardDetailsModal }) => {
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
                                    {board.board_name}
                                </h3>
                                <div>
                                    <p>
                                        <span className={`font-semibold text-sm dark:text-white text-black`}>Rarity: </span>
                                        <span className={`text-md ${rarityMapping[board.rarity as Rarity]}`}>
                                            {board.rarity}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm dark:text-white text-black">
                                        <span className="font-semibold">Date acquired:</span> {formatDate(board.acquired_at || '')}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="absolute top-4 right-4 cursor-pointer text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={() => {
                                    setShowBoardDetailsModal(false);
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
                                    className={`grid grid-cols-2 grid-rows-2 w-30 h-30 transition-all duration-200`}
                                >
                                    <div className={`w-full h-full ${board.whiteSquare}`} />
                                    <div className={`w-full h-full ${board.blackSquare}`} />
                                    <div className={`w-full h-full ${board.blackSquare}`} />
                                    <div className={`w-full h-full ${board.whiteSquare}`} />
                                </div>
                            </div>
                        </div>


                        {/* Modal Body */}
                        <div className="p-4 md:p-5 space-y-4 flex justify-center">
                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                {board.description}
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
                                        setShowBoardDetailsModal(false);
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

interface BoardsPageProps {
    allOwnedBoards: Array<Board>;
    selectedBoard: Board | null;
    setSelectedBoard: (board_id: Board) => void;
}


const BoardsPage: React.FC<BoardsPageProps> = ({ allOwnedBoards, selectedBoard, setSelectedBoard }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [equipped, setEquipped] = useState<number>(-1);
    const [showBoardDetailsModal, setShowBoardDetailsModal] = useState(false);
    const [modalBoard, setModalBoard] = useState<Board | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        if (selectedBoard) {
            setEquipped(selectedBoard.board_id);
        }
    }, [selectedBoard]);

    const handleClick = (index: number) => {
        setSelectedIndex(prev => (prev === index ? null : index)); // toggle selection
    };

    const handleEquip = async (board: Board) => {
        try {
            if (user) {
                await updateUserInfo(user.id, { selected_board_id: board.board_id })
                setSelectedBoard(board);
            }
        } catch (error) {
            console.error("Failed to update the board: ", error);
            setEquipped(-1);
        }
    }

    const handleDetails = (board: Board) => {
        setModalBoard(board);
        setShowBoardDetailsModal(true);
    };

    return (
        <>
            <div className="w-full flex flex-row flex-wrap gap-2 dark:bg-slate-600 bg-gray-300 p-4 rounded-lg">
                {allOwnedBoards.map((board) => (
                    <div key={board.board_id} className="flex flex-col items-center gap-2">
                        <div
                            onClick={() => handleClick(board.board_id)}
                            className={`grid grid-cols-2 grid-rows-2 w-30 h-30 rounded-md border-2 p-4 transition-all duration-200 cursor-pointer ${selectedIndex === board.board_id
                                ? 'dark:border-gray-400 border-gray-500'
                                : 'border-transparent hover:border-gray-400 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className={`w-full h-full ${board.whiteSquare}`} />
                            <div className={`w-full h-full ${board.blackSquare}`} />
                            <div className={`w-full h-full ${board.blackSquare}`} />
                            <div className={`w-full h-full ${board.whiteSquare}`} />
                        </div>
                        {selectedIndex === board.board_id && (
                            <SelectedItemMenu
                                onEquipFn={() => { handleEquip(board) }}
                                onDetailsFn={() => handleDetails(board)}
                                equipped={equipped}
                                index={board.board_id}
                            />
                        )}
                    </div>
                ))}
            </div>
            {showBoardDetailsModal && modalBoard && (
                <BoardDetailsModal board={modalBoard} setShowBoardDetailsModal={setShowBoardDetailsModal} />
            )}

        </>

    );
};

export default BoardsPage;