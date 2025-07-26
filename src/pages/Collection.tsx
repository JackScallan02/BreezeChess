import MainToolBar from "../components/MainToolBar";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

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
    const [displayType, setDisplayType] = useState('white'); // white, black, or both
    const [allPieces, setAllPieces] = useState<Array<Piece>>([]);
    const [displayedPieces, setDisplayedPieces] = useState<DisplayedPieces>({
        white: { p: '', r: '', n: '', b: '', q: '', k: '' },
        black: { p: '', r: '', n: '', b: '', q: '', k: '' },
    });

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
                <div className="p-4 min-h-[200px] h-full">
                    <div className="w-full"><p></p></div>
                    <CollectionDisplay displayedPieces={displayedPieces} displayType={displayType} />
                </div>
                <CollectionContainer allPieces={allPieces} />
            </div>
        </>
    );
};



interface CollectionDisplayProps {
    displayedPieces: DisplayedPieces;
    displayType: string;
}

const CollectionDisplay: React.FC<CollectionDisplayProps> = ({ displayedPieces, displayType }) => {

    return (
        <>
            {displayType === 'white' && (
                <div className="w-full flex justify-center items-center h-full">
                    <div
                        className={`
                            grid
                            gap-4
                            gap-x-2
                            justify-center
                            items-end
                            w-full
                            max-w-[90vw]
                            md:flex md:flex-row md:gap-x-12
                        `}
                        style={{
                            gridTemplateColumns: 'repeat(3, 1fr)',
                        }}
                    >
                        {(['p', 'r', 'k', 'q', 'b', 'n'] as PieceCode[]).map((piece) => (
                            <img
                                key={piece}
                                src={displayedPieces.white[piece]}
                                alt={`White ${piece}`}
                                draggable={false}
                                className="select-none lg:h-30 md:h-20 h-15 object-scale-down"
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );

};

interface CollectionContainerProps {
    allPieces: Array<Piece>;
}

const CollectionContainer: React.FC<CollectionContainerProps> = ({ allPieces }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') as Tab;
    const [activeTab, setActiveTab] = useState<Tab>(validTabs.includes(initialTab) ? initialTab : 'sets');

    // Sync tab to URL when activeTab changes
    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

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
                {activeTab === 'boards' && <div>Display Board content here</div>}
                {activeTab === 'effects' && <div>Display Effect content here</div>}
            </div>
        </div>
    );
};

interface PiecesPageProps {
    allPieces: Array<Piece>;
}

const PiecesPage: React.FC<PiecesPageProps> = ({ allPieces }) => {
    return (
<div className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(5rem,1fr))] gap-2 bg-slate-600 pt-4 pb-4 rounded-lg">
    {allPieces.map((piece) => (
        <img
            key={piece.src}
            src={piece.src}
            className="aspect-square min-h-20 w-full object-contain"
        />
    ))}
</div>

    )
}

export default Collection;