import MainToolBar from "../../components/MainToolBar";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUserData } from "../../contexts/UserDataContext";
import { Board } from "../../types/board";
import { PieceCode, DisplayedPieces, Piece } from "../../types/Piece";
import PiecesPage from "./PiecesPage";
import BoardsPage from "./BoardsPage";
import { useAuth } from "../../contexts/AuthContext";
import { getPieces } from "../../api/pieces";


const validTabs = ['sets', 'pieces', 'boards', 'effects'] as const;
type Tab = typeof validTabs[number];

const Collection = () => {
    const [allPieces, setAllPieces] = useState<Array<Piece>>([]);
    const [dropDownExpanded, setDropDownExpanded] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialDisplay = searchParams.get('display') || 'both';
    const initialTab = searchParams.get('tab') || 'sets';
    const { user } = useAuth();
    const { allOwnedBoards, selectedBoard, setUserDataField, selectedPieces } = useUserData();

    const [displayType, setDisplayType] = useState(initialDisplay);
    const [displayState, setDisplayState] = useState(() => {
        if (initialDisplay === 'w') return 'Show white only';
        if (initialDisplay === 'b') return 'Show black only';
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

    const [displayedPieces, setDisplayedPieces] = useState<any>({
        w: {},
        b: {},
    });

    useEffect(() => {
        const displayParam = searchParams.get('display') || 'both';
        setDisplayType(displayParam);
        if (displayParam === 'w') setDisplayState('Show white only');
        else if (displayParam === 'b') setDisplayState('Show black only');
        else setDisplayState('Show black and white');
    }, [searchParams]);

    useEffect(() => {
        const fetchPieces = async () => {
            if (user) {
                const res = await getPieces(user.id);
                setAllPieces(res);
            }
        };

        fetchPieces();
    }, [user]);

  useEffect(() => {
    if (!allPieces.length || !selectedPieces) return;

    const pieceCodes: PieceCode[] = ['p', 'r', 'n', 'b', 'q', 'k'];

    const pieceById = allPieces.reduce((acc: Record<string, Piece>, piece) => {
      acc[piece.piece_id] = piece;
      return acc;
    }, {});

    const result: any = { w: {}, b: {} };

    for (const color of ["w", "b"] as const) {
      for (const type of pieceCodes) {
        const pieceId = selectedPieces[color]?.[type];
        const pieceObj = pieceId ? pieceById[pieceId] : undefined;
        result[color][type] = pieceObj || '';
      }
    }

    setDisplayedPieces(result);
  }, [selectedPieces, allPieces]);
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
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        {dropDownExpanded && (
                            <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                    <li>
                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.set('display', 'b');
                                                setSearchParams(newParams);
                                                setDisplayType('b');
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
                                                newParams.set('display', 'w');
                                                setSearchParams(newParams);
                                                setDisplayType('w');
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
                    <MainCollectionDisplay displayedPieces={displayedPieces} displayType={displayType} />
                </div>
                <CollectionContainer
                    allPieces={allPieces}
                    allOwnedBoards={allOwnedBoards}
                    activeTab={activeTab}
                    selectedBoard={selectedBoard}
                    setActiveTab={setActiveTab}
                />
            </div>
        </>
    );
};



interface MainCollectionDisplayProps {
    displayedPieces: DisplayedPieces;
    displayType: string;
}

const MainCollectionDisplay: React.FC<MainCollectionDisplayProps> = ({ displayedPieces, displayType }) => {

    const getDisplayedPieces = () => {
        if (displayType === 'w') {
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
                            src={displayedPieces.w[piece]?.signed_url || undefined}
                            alt={`White ${piece}`}
                            draggable={false}
                            className="select-none lg:h-30 md:h-20 h-15 transition-all object-scale-down"
                        />

                    ))}
                </div>
            )
        } else if (displayType === 'b') {
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
                            src={displayedPieces.b[piece]?.signed_url || undefined}
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
                            src={displayedPieces.w[piece]?.signed_url || undefined}
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
                            src={displayedPieces.b[piece]?.signed_url || undefined}
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
    selectedBoard: Board | null;
    setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}


const CollectionContainer: React.FC<CollectionContainerProps> = ({ allPieces, allOwnedBoards, activeTab, setActiveTab, selectedBoard }) => {

    return (
        <div className="dark:bg-slate-900 bg-gray-200 w-full h-full min-h-[200px] border-t border-gray-700">
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
                {activeTab === 'boards' && <BoardsPage allOwnedBoards={allOwnedBoards} selectedBoard={selectedBoard} />}
                {activeTab === 'effects' && <div>Display Effect content here</div>}
            </div>
        </div>
    );
};







export default Collection;