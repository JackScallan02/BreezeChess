import React, { useState } from 'react';
import { useNavigation } from '../navigator/navigate';

// Data for the left tree (Checkmates)
const checkmatesData = {
  "Mates": [
    {
      name: "General Checkmates",
      items: [
        { id: "mateIn1", name: "Mate in 1", description: "A checkmate delivered in a single move." },
        { id: "mateIn2", name: "Mate in 2", description: "A checkmate requiring two moves to complete." },
        { id: "mateIn3", name: "Mate in 3", description: "A checkmate requiring three moves to complete." },
        { id: "mateIn4", name: "Mate in 4", description: "A checkmate requiring four moves to complete." },
        { id: "mateIn5", name: "Mate in 5", description: "A checkmate requiring five moves to complete." },
        { id: "mate", name: "Mate in ?", description: "A checkmate puzzle with an unknown number of moves." }
      ]
    },
    {
      name: "Named Checkmates",
      items: [
        { id: "anastasiaMate", name: "Anastasia’s Mate", description: "A checkmate involving a rook and knight against the king trapped on the h-file." },
        { id: "backRankMate", name: "Back-rank Mate", description: "A checkmate delivered by a rook or queen on the back rank when the king is blocked by its own pawns." },
        { id: "doubleBishopMate", name: "Double Bishop Mate", description: "A checkmate delivered by two bishops, typically forcing the king to the edge of the board." },
        { id: "hookMate", name: "Hook Mate", description: "A checkmate pattern using a rook, knight, and pawn to trap the king." },
        { id: "vukovicMate", name: "Vuković's Mate", description: "A checkmate pattern often involving a rook and pawn against a king on the edge of the board." },
        { id: "arabianMate", name: "Arabian Mate", description: "A checkmate pattern involving a knight and a rook." },
        { id: "bodenMate", name: "Boden’s Mate", description: "A checkmate pattern where the king is checkmated by two bishops on intersecting diagonals." },
        { id: "dovetailMate", name: "Dovetail Mate", description: "A checkmate pattern resembling a dovetail joint, often with a queen and another piece." },
        { id: "killBoxMate", name: "Kill Box Mate", description: "A checkmate where the king is trapped in a small 'box' by attacking pieces." },
        { id: "smotheredMate", name: "Smothered Mate", description: "A checkmate delivered by a knight when the king is completely surrounded and blocked by its own pieces." }
      ]
    }
  ],
  "Phases": [
    {
      name: "Opening",
      items: [
        { id: "opening", name: "Opening Phase", description: "The beginning of the game, focused on development and king safety." },
        { id: "castling", name: "Castling", description: "A special move to protect the king and activate a rook." }
      ]
    },
    {
      name: "Middlegame",
      items: [
        { id: "middlegame", name: "Middlegame Concepts", description: "The phase of the game with active tactics and strategy." },
        //TODO
        // { id: "pawnStructures", name: "Pawn Structures", description: "Learn about the arrangement of pawns and their strategic implications." },
        // { id: "pieceCoordination", name: "Piece Coordination", description: "Develop skills in harmonizing the movement of your pieces." }
      ]
    },
    {
      name: "Endgame",
      items: [
        { id: "endgame", name: "Endgame Principles", description: "General techniques for finishing the game." },
        { id: "queenRookEndgame", name: "Queen & Rook Endgame", description: "Master endgames involving a queen and a rook." },
        { id: "rookEndgame", name: "Rook Endgame", description: "Study common rook endgame principles and techniques." },
        { id: "queenEndgame", name: "Queen Endgame", description: "Learn strategies for queen endgames." },
        { id: "knightEndgame", name: "Knight Endgame", description: "Understand knight endgame principles and common patterns." },
        { id: "bishopEndgame", name: "Bishop Endgame", description: "Explore bishop endgame strategies and maneuvers." },
        { id: "pawnEndgame", name: "Pawn Endgame", description: "Learn to convert pawn advantages into wins." }
      ]
    }
  ],
  "Lengths": [
    {
      name: "Puzzle Duration",
      items: [
        { id: "oneMove", name: "One Move", description: "Puzzles that can be solved in a single move." },
        { id: "short", name: "Short (2 moves)", description: "Puzzles requiring exactly two moves to solve." },
        { id: "long", name: "Long (3 moves)", description: "Puzzles requiring exactly three moves to solve." },
        { id: "veryLong", name: "Very Long (4+ moves)", description: "Challenging puzzles requiring four or more moves." }
      ]
    }
  ]
};

const tacticsData = {
  "Tactics": [
    {
      name: "Basic Tactics",
      items: [
        { id: "fork", name: "Fork", description: "A tactic where a single piece attacks two or more of the opponent's pieces simultaneously." },
        { id: "pin", name: "Pin", description: "A tactic where an attacking piece restricts the movement of a defending piece, which cannot move without exposing a more valuable piece behind it." },
        { id: "skewer", name: "Skewer", description: "A tactic where an attacking piece attacks two valuable pieces in a line, forcing the more valuable piece to move and exposing the less valuable one." },
        { id: "discoveredAttack", name: "Discovered Attack", description: "An attack that occurs when one piece moves, unblocking the line of attack of another piece." },
        { id: "hangingPiece", name: "Hanging Piece", description: "An undefended piece that is vulnerable to capture." }
      ]
    },
    {
      name: "Advanced Tactics",
      items: [
        { id: "advancedPawn", name: "Advanced Pawn", description: "A pawn that has moved far into the opponent's territory and is difficult to stop." },
        { id: "attackingF2F7", name: "Attacking f2/f7", description: "A common early game strategy targeting the weakest pawns in the opponent's position." },
        { id: "sacrifice", name: "Sacrifice", description: "Intentionally giving up material (a piece or pawn) to gain a strategic advantage or deliver a checkmate." },
        { id: "trappedPiece", name: "Trapped Piece", description: "A piece that has no legal moves and is likely to be captured." },
        { id: "capturingDefender", name: "Capture the Defender", description: "A tactic where you capture a piece that is defending another piece or a critical square." },
        { id: "doubleCheck", name: "Double Check", description: "A powerful check where two pieces simultaneously attack the king." }
      ]
    }
  ],
  "Advanced": [
    {
      name: "Positional Concepts",
      items: [
        { id: "zugzwang", name: "Zugzwang", description: "A situation where any move a player makes worsens their position." },
        { id: "defensiveMove", name: "Defensive Move", description: "A move made to protect a piece or square, or to improve the king's safety." },
        { id: "quietMove", name: "Quiet Move", description: "A move that does not immediately attack or capture, but prepares for future plans." },
        { id: "clearance", name: "Clearance", description: "Moving a piece to open a line for another piece or to clear a square for a different purpose." }
      ]
    },
    {
      name: "Complex Tactics",
      items: [
        { id: "intermezzo", name: "Intermezzo (In-between move)", description: "An unexpected intermediate move that interrupts an opponent's planned sequence." },
        { id: "interference", name: "Interference", description: "Blocking the line of attack or defense between two of the opponent's pieces." },
        { id: "attraction", name: "Attraction", description: "Luring an opponent's piece to a square where it can be attacked or trapped." },
        { id: "deflection", name: "Deflection", description: "Forcing an opponent's piece to move away from a square or line it is defending." },
        { id: "xrayAttack", name: "X-ray Attack", description: "An attack through an opponent's piece to a more valuable piece or square behind it." }
      ]
    }
  ],
  "Goals": [
    {
      name: "Game Objectives",
      items: [
        { id: "equality", name: "Equality", description: "Achieving a balanced position with no significant advantage for either side." },
        { id: "advantage", name: "Advantage", description: "Gaining a favorable position over the opponent." },
        { id: "crushing", name: "Crushing", description: "Achieving a dominant and overwhelming position." }
      ]
    }
  ],
  "Special Moves": [
    {
      name: "Unique Rules",
      items: [
        { id: "castling", name: "Castling", description: "A special move involving the king and one of the rooks." },
        { id: "enPassant", name: "En Passant", description: "A special pawn capture that can only occur immediately after an opponent's pawn moves two squares." },
        { id: "promotion", name: "Promotion", description: "When a pawn reaches the eighth rank and is replaced by a queen, rook, bishop, or knight." },
        { id: "underpromotion", name: "Underpromotion", description: "Promoting a pawn to a rook, bishop, or knight instead of a queen." }
      ]
    }
  ]
};


/**
 * A reusable component to display a leaf node in the tree (a grid of buttons).
 * It now manages state to show a description when an item button is clicked.
 */
const TrainingMethodSection = ({ items }) => {
    const [activeItem, setActiveItem] = useState(null); // State to track the currently active item's ID
    const { handleNavigation } = useNavigation();

    const handleItemClick = (item) => {
        // Toggle description: if clicked item is already active, close it; otherwise, open it.
        setActiveItem(prevActiveItem => (prevActiveItem === item.id ? null : item.id));
    };

    const handleStartTraining = () => {
        if (activeItem) {
            // Find the full item object to get its name for the URL if needed, though 'id' is sufficient
            const selectedItem = items.find(item => item.id === activeItem);
            if (selectedItem) {
                handleNavigation(selectedItem.id);
            }
        }
    };

    return (
        <div className="flex flex-col"> {/* Use flex-col to stack buttons and description */}
            <div className="flex flex-wrap gap-2 pt-3">
                {items.map(item => (
                    <button
                        key={item.id} // Use item.id for key
                        onClick={() => handleItemClick(item)}
                        className={`px-3 py-1.5 border rounded-md shadow-sm text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
                            ${activeItem === item.id ? 'bg-blue-500 text-white border-blue-600' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'}`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
            {/* Display the description and the "Start Training" button if an item is active */}
            {activeItem && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-slate-700 text-sm">
                    <p className="text-[1rem]">{items.find(item => item.id === activeItem)?.description || "No description available."}</p>
                    <button
                        onClick={handleStartTraining}
                        className="mt-3 px-2.5 py-1.5 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                        Start Training
                    </button>
                </div>
            )}
        </div>
    );
};


/**
 * A component representing one major branch of the training tree.
 */
const TreeBranch = ({ category, subCategories, isOpen, onToggle }) => (
    <div className="relative pl-8">
        {/* Horizontal line from trunk to content */}
        {/* This line remains h-0.5 w-5 bg-purple-600 as its consistency is less affected */}
        <div className="absolute left-[18px] top-4 h-0.5 w-5 bg-purple-600"></div>

        {/* The circular node on the main trunk */}
        <div className={`absolute left-3 top-4 -translate-y-1/3 w-3 h-3 rounded-full transition-colors ${isOpen ? 'bg-blue-500 border-white' : 'bg-slate-300 border-white'} border-2`}></div>

        {/* The content container for the branch */}
        <div className="relative pl-8">
            <h3
                onClick={onToggle}
                className="text-xl font-bold text-slate-800 dark:text-white cursor-pointer hover:text-blue-600 transition-colors select-none"
            >
                {category}
            </h3>
            {isOpen && (
                <div className="mt-4 space-y-4">
                    {subCategories.map(sub => (
                        <div key={sub.name} className="p-4 bg-slate-100/70 dark:bg-slate-800 rounded-lg border border-slate-200/80">
                            <h4 className="font-semibold text-slate-700 dark:text-white">{sub.name}</h4>
                            {/* Pass the items including their descriptions to TrainingMethodSection */}
                            <TrainingMethodSection items={sub.items} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

/**
 * A reusable component for rendering a complete tree structure.
 * The 'title' prop has been removed from this component.
 */
const Tree = ({ data }) => {
    // Initialize openBranches to have all categories open by default
    const [openBranches, setOpenBranches] = useState(() => {
        const initialOpenState = {};
        Object.keys(data).forEach(category => {
            initialOpenState[category] = true;
        });
        return initialOpenState;
    });

    const toggleBranch = (category) => {
        setOpenBranches(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const categories = Object.keys(data);

    return (
        <div className="w-full">
            <div className="relative pt-4"> {/* Added padding to align content */}
                {/* The main vertical trunk of the tree.
                  Changed from w-[2px] to a w-0 div with a right border-r-2.
                  This ensures a consistent 2px thickness regardless of browser scaling,
                  as borders are rendered more reliably.
                */}
                <div className="absolute left-4 top-0 bottom-0 w-0 border-r-2 border-purple-600"></div>
                <div className="space-y-8">
                    {categories.map((category) => (
                        <TreeBranch
                            key={category}
                            category={category}
                            subCategories={data[category]}
                            isOpen={!!openBranches[category]}
                            onToggle={() => toggleBranch(category)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * The main component that lays out the two training trees.
 */
const TrainingTree = () => {
    return (
        // Replaced percentage-based max-width with a fixed max-width (max-w-7xl)
        // to prevent browser sub-pixel rendering issues on resize.
        <div className="w-full max-w-7xl mx-auto p-4 font-sans flex flex-col md:flex-row gap-x-32">
            <div className="w-full"><Tree data={checkmatesData} /></div>
            <div className="w-full"><Tree data={tacticsData} /></div>
        </div>
    );
};


/**
 * Main App component to render the TrainingTree.
 * Now includes the single, centralized title for the entire page.
 */
export default function App() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center pt-8 md:pt-16">
            {/* The single, centralized title and subtitle */}
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight text-center dark:text-white">
                Choose a training method
            </h1>
            <p className="text-center text-slate-500 dark:text-slate-300 mb-10">Click on a training method to see its description.</p>

            <TrainingTree/>
        </div>
    );
}
