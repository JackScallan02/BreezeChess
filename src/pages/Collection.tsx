import MainToolBar from "../components/MainToolBar";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserData } from "../contexts/UserDataContext";
import { Board } from "../types/board";

const validTabs = ['sets', 'pieces', 'boards', 'effects'] as const;
type Tab = typeof validTabs[number];

type PieceCode = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type Color = 'white' | 'black';
type PieceSet = Record<PieceCode, string>;
type DisplayedPieces = Record<Color, PieceSet>;
interface Piece {
    src: string;
    type: string;
    color: string;
}

const Collection = () => {
    const [allPieces, setAllPieces] = useState<Array<Piece>>([]);
    const [dropDownExpanded, setDropDownExpanded] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialDisplay = searchParams.get('display') || 'both';
    const initialTab = searchParams.get('tab') || 'sets';
    const { allOwnedBoards } = useUserData();

    const [displayType, setDisplayType] = useState(initialDisplay);
    const [displayState, setDisplayState] = useState(() => {
        if (initialDisplay === 'white') return 'Show white only';
        if (initialDisplay === 'black') return 'Show black only';
        return 'Show black and white';
    });

    const [activeTab, setActiveTab] = useState<Tab>(
        validTabs.includes(initialTab as Tab) ? (initialTab as Tab) : 'sets'
    );

    // Update query params on change
    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('display', displayType);
        newParams.set('tab', activeTab);
        setSearchParams(newParams);
    }, [displayType, activeTab]);

    const [displayedPieces, setDisplayedPieces] = useState<DisplayedPieces>({
        white: { p: '', r: '', n: '', b: '', q: '', k: '' },
        black: { p: '', r: '', n: '', b: '', q: '', k: '' },
    });

    useEffect(() => {
        const displayParam = searchParams.get('display') || 'both';
        setDisplayType(displayParam);
        if (displayParam === 'white') setDisplayState('Show white only');
        else if (displayParam === 'black') setDisplayState('Show black only');
        else setDisplayState('Show black and white');
    }, [searchParams]);


    useEffect(() => {
        // On initial load, get all of their pieces from API, as well as their "selected" pieces (which to display by default)
        // For now, hardcode it
        const pieces: DisplayedPieces = {
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
        }
        setDisplayedPieces(pieces);

        // Temporarily hardcoding all pieces here - will be replaced with all pieces that user owns
        const allPieces: Array<Piece> = [
            // Beta - White
            { src: '/assets/chess_pieces/beta/w/k.png', color: 'white', type: 'k' },
            { src: '/assets/chess_pieces/beta/w/q.png', color: 'white', type: 'q' },
            { src: '/assets/chess_pieces/beta/w/r.png', color: 'white', type: 'r' },
            { src: '/assets/chess_pieces/beta/w/b.png', color: 'white', type: 'b' },
            { src: '/assets/chess_pieces/beta/w/n.png', color: 'white', type: 'n' },
            { src: '/assets/chess_pieces/beta/w/p.png', color: 'white', type: 'p' },

            // Beta - Black
            { src: '/assets/chess_pieces/beta/b/k.png', color: 'black', type: 'k' },
            { src: '/assets/chess_pieces/beta/b/q.png', color: 'black', type: 'q' },
            { src: '/assets/chess_pieces/beta/b/r.png', color: 'black', type: 'r' },
            { src: '/assets/chess_pieces/beta/b/b.png', color: 'black', type: 'b' },
            { src: '/assets/chess_pieces/beta/b/n.png', color: 'black', type: 'n' },
            { src: '/assets/chess_pieces/beta/b/p.png', color: 'black', type: 'p' },

            // Default - White
            { src: '/assets/chess_pieces/default/w/k.png', color: 'white', type: 'k' },
            { src: '/assets/chess_pieces/default/w/q.png', color: 'white', type: 'q' },
            { src: '/assets/chess_pieces/default/w/r.png', color: 'white', type: 'r' },
            { src: '/assets/chess_pieces/default/w/b.png', color: 'white', type: 'b' },
            { src: '/assets/chess_pieces/default/w/n.png', color: 'white', type: 'n' },
            { src: '/assets/chess_pieces/default/w/p.png', color: 'white', type: 'p' },

            // Default - Black
            { src: '/assets/chess_pieces/default/b/k.png', color: 'black', type: 'k' },
            { src: '/assets/chess_pieces/default/b/q.png', color: 'black', type: 'q' },
            { src: '/assets/chess_pieces/default/b/r.png', color: 'black', type: 'r' },
            { src: '/assets/chess_pieces/default/b/b.png', color: 'black', type: 'b' },
            { src: '/assets/chess_pieces/default/b/n.png', color: 'black', type: 'n' },
            { src: '/assets/chess_pieces/default/b/p.png', color: 'black', type: 'p' },
        ];

        setAllPieces(allPieces);


    }, []);
    return (
        <>
            <MainToolBar />
            <div
                className="w-full flex flex-col justify-between"
                style={{ height: 'calc(100vh - 64px)' }}
            >
                <div className="p-4 flex flex-col gap-4">
                    <div className="w-full">
                        <button
                            id="dropdownDefaultButton"
                            className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                            focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center
                            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            type="button"
                            onClick={() => setDropDownExpanded((prev) => !prev)}
                        >
                            {displayState}
                            <svg className="w-2.5 h-2.5 ms-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        {dropDownExpanded && (
                            <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.set('display', 'black');
                                                setSearchParams(newParams);
                                                setDisplayType('black');
                                                setDisplayState('Show black only');
                                                setDropDownExpanded(false);
                                            }}
                                            className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Show black only
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.set('display', 'white');
                                                setSearchParams(newParams);
                                                setDisplayType('white');
                                                setDisplayState('Show white only');
                                                setDropDownExpanded(false);
                                            }}
                                            className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Show white only
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                setSearchParams({ display: 'both' });
                                                setDisplayType('both');
                                                setDisplayState('Show black and white');
                                                setDropDownExpanded(false);
                                            }}
                                            className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            Show black and white
                                        </button>
                                    </li>
                                </ul>

                            </div>
                        )}

                    </div>
                    <CollectionDisplay displayedPieces={displayedPieces} displayType={displayType} />
                </div>
                <CollectionContainer
                    allPieces={allPieces}
                    allOwnedBoards={allOwnedBoards}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
        </>
    );
};



interface CollectionDisplayProps {
    displayedPieces: DisplayedPieces;
    displayType: string;
}

const CollectionDisplay: React.FC<CollectionDisplayProps> = ({ displayedPieces, displayType }) => {

    const getDisplayedPieces = () => {
        if (displayType === 'white') {
            return (
                <div
                    className={`
                        flex flex-row flex-wrap
                        gap-y-4
                        justify-evenly
                        items-end
                        w-[75%]
                    `}
                >
                    {(['p', 'r', 'k', 'q', 'b', 'n'] as PieceCode[]).map((piece) => (

                        <img
                            key={piece}
                            src={displayedPieces.white[piece]}
                            alt={`White ${piece}`}
                            draggable={false}
                            className="select-none lg:h-30 md:h-20 h-15 transition-all object-scale-down"
                        />

                    ))}
                </div>
            )
        } else if (displayType === 'black') {
            return (
                <div
                    className={`
                        flex flex-row flex-wrap
                        gap-y-4
                        justify-evenly
                        items-end
                        w-[75%]
                    `}
                >
                    {(['p', 'r', 'k', 'q', 'b', 'n'] as PieceCode[]).map((piece) => (

                        <img
                            key={piece}
                            src={displayedPieces.black[piece]}
                            alt={`Black ${piece}`}
                            draggable={false}
                            className="select-none lg:h-30 md:h-20 h-15 transition-all object-scale-down"
                        />

                    ))}
                </div>
            )
        }

        return (
            <div className="flex flex-col gap-y-8 w-[75%]">
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
                            src={displayedPieces.white[piece]}
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
                            src={displayedPieces.black[piece]}
                            alt={`Black ${piece}`}
                            draggable={false}
                            className="select-none lg:h-30 md:h-20 h-15 transition-all object-scale-down"
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="w-full flex justify-center items-center h-full">
                {getDisplayedPieces()}
            </div>
        </>
    );

};

interface CollectionContainerProps {
    allPieces: Array<Piece>;
    allOwnedBoards: Array<Board>;
    activeTab: Tab;
    setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}


const CollectionContainer: React.FC<CollectionContainerProps> = ({ allPieces, allOwnedBoards, activeTab, setActiveTab }) => {

    return (
        <div className="bg-slate-900 w-full h-full min-h-[200px] border-t border-gray-700">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 ml-2 mt-1">
                {validTabs.map((tab) => (
                    <li key={tab} className="mr-4">
                        <button
                            onClick={() => setActiveTab(tab)}
                            className={`inline-block px-6 py-3 rounded-lg cursor-pointer lg:text-xl text-md ${activeTab === tab
                                ? 'text-white bg-blue-600'
                                : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="p-4 text-white w-full">
                {activeTab === 'sets' && <div>Display Set content here</div>}
                {activeTab === 'pieces' && <PiecesPage allPieces={allPieces} />}
                {activeTab === 'boards' && <BoardsPage allOwnedBoards={allOwnedBoards} />}
                {activeTab === 'effects' && <div>Display Effect content here</div>}
            </div>
        </div>
    );
};

interface PiecesPageProps {
    allPieces: Array<Piece>;
}

const PiecesPage: React.FC<PiecesPageProps> = ({ allPieces }) => {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const handleClick = (src: string) => {
        setSelectedImg(prev => (prev === src ? null : src)); // toggle
    };
    return (
        <div className="w-full flex flex-row flex-wrap gap-2 bg-slate-600 p-4 rounded-lg">
            {allPieces.map((piece) => (
                <div
                    key={piece.src}
                    onClick={() => handleClick(piece.src)}
                    className={`flex h-full cursor-pointer flex-col lg:h-30 lg:w-30 h-20 w-20 transition-all items-center justify-between gap-3 rounded-md border-2 p-2 transition-all duration-200 ${selectedImg === piece.src
                        ? 'border-gray-400 bg-slate-700'
                        : 'border-transparent hover:border-gray-500'
                        }`}
                >
                    <img
                        src={piece.src}
                        className="h-auto w-full rounded-sm object-contain select-none"
                        draggable={false}
                    />
                    {selectedImg === piece.src && (
                        <SelectedItemMenu />
                    )}
                </div>
            ))}
        </div>
    );
};

interface BoardsPageProps {
    allOwnedBoards: Array<Board>;
}

const BoardsPage: React.FC<BoardsPageProps> = ({ allOwnedBoards }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setSelectedIndex(prev => (prev === index ? null : index)); // toggle selection
    };

    return (
        <div className="w-full flex flex-row flex-wrap gap-2 bg-slate-600 p-4 rounded-lg">
            {allOwnedBoards.map((board, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                    <div
                        onClick={() => handleClick(index)}
                        className={`grid grid-cols-2 grid-rows-2 w-30 h-30 rounded-md border-2 p-4 transition-all duration-200 cursor-pointer ${selectedIndex === index
                            ? 'border-gray-400'
                            : 'border-transparent hover:border-gray-500'
                            }`}
                    >
                        <div className={`w-full h-full ${board.whiteSquare}`} />
                        <div className={`w-full h-full ${board.blackSquare}`} />
                        <div className={`w-full h-full ${board.blackSquare}`} />
                        <div className={`w-full h-full ${board.whiteSquare}`} />
                    </div>
                    {selectedIndex === index && (
                        <SelectedItemMenu />
                    )}
                </div>
            ))}
        </div>
    );
};

const SelectedItemMenu = () => (
    <div className="flex flex-col gap-y-2 w-full">
        <button
            className="w-full cursor-pointer rounded bg-indigo-600 py-1 text-sm text-white transition hover:bg-indigo-700"
            onClick={() => { }}
        >
            Equip
        </button>
        <button className="w-full cursor-pointer rounded bg-indigo-600 py-1 text-sm text-white transition hover:bg-indigo-700">
            Details
        </button>
    </div>
);

export default Collection;