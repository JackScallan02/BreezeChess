import FrontPage from "../../pages/FrontPage";
import Login from "../../pages/Login";
import About from "../../pages/About";
import Register from "../../pages/Register";
import Home from "../../pages/Home";
import Welcome from "../../pages/Welcome";
import Profile from "../../pages/Profile";
import Contact from "../../pages/Contact";
import Train from "../../pages/Train";
import BoardBuilder from "../../pages/BoardBuilder";
import React from 'react';
import PuzzleHome from "../../pages/PuzzleHome";
import PuzzleType from "../../components/PuzzleType";

interface Route {
  path: string;
  element: React.JSX.Element
}

export const ROUTES: Array<Route> = [
  {
    path: "/",
    element: <FrontPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/train",
    element: <Train />
  },
  {
    path: "/train/board-builder",
    element: <BoardBuilder />
  },
  {
    path: "/train/puzzle",
    element: <PuzzleHome />
  },
  {
    path: "/train/puzzle/mateIn1",
    element: <PuzzleType title="Mate in 1" themes={["mateIn1"]} />
  },
  {
    path: "/train/puzzle/mateIn2",
    element: <PuzzleType title="Mate in 2" themes={["mateIn2"]} />
  },
  {
    path: "/train/puzzle/mateIn3",
    element: <PuzzleType title="Mate in 3" themes={["mateIn3"]} />
  },
  {
    path: "/train/puzzle/mateIn4",
    element: <PuzzleType title="Mate in 4" themes={["mateIn4"]} />
  },
  {
    path: "/train/puzzle/mateIn5",
    element: <PuzzleType title="Mate in 5" themes={["mateIn5"]} />
  },
  {
    path: "/train/puzzle/mate",
    element: <PuzzleType title="Mate in ?" themes={["mate"]} />
  },

  // Named Checkmates
  {
    path: "/train/puzzle/anastasiaMate",
    element: <PuzzleType title="Anastasia’s Mate" themes={["anastasiaMate"]} />
  },
  {
    path: "/train/puzzle/backRankMate",
    element: <PuzzleType title="Back-rank Mate" themes={["backRankMate"]} />
  },
  {
    path: "/train/puzzle/doubleBishopMate",
    element: <PuzzleType title="Double Bishop Mate" themes={["doubleBishopMate"]} />
  },
  {
    path: "/train/puzzle/hookMate",
    element: <PuzzleType title="Hook Mate" themes={["hookMate"]} />
  },
  {
    path: "/train/puzzle/vukovicMate",
    element: <PuzzleType title="Vuković's Mate" themes={["vukovicMate"]} />
  },
  {
    path: "/train/puzzle/arabianMate",
    element: <PuzzleType title="Arabian Mate" themes={["arabianMate"]} />
  },
  {
    path: "/train/puzzle/bodenMate",
    element: <PuzzleType title="Boden’s Mate" themes={["bodenMate"]} />
  },
  {
    path: "/train/puzzle/dovetailMate",
    element: <PuzzleType title="Dovetail Mate" themes={["dovetailMate"]} />
  },
  {
    path: "/train/puzzle/killBoxMate",
    element: <PuzzleType title="Kill Box Mate" themes={["killBoxMate"]} />
  },
  {
    path: "/train/puzzle/smotheredMate",
    element: <PuzzleType title="Smothered Mate" themes={["smotheredMate"]} />
  },

  // Phases
  {
    path: "/train/puzzle/opening",
    element: <PuzzleType title="Opening Phase" themes={["opening"]} />
  },
  {
    path: "/train/puzzle/castling",
    element: <PuzzleType title="Castling" themes={["castling"]} />
  },
  {
    path: "/train/puzzle/middlegame",
    element: <PuzzleType title="Middlegame Concepts" themes={["middlegame"]} />
  },
  {
    path: "/train/puzzle/endgame",
    element: <PuzzleType title="Endgame Principles" themes={["endgame"]} />
  },
  {
    path: "/train/puzzle/queenRookEndgame",
    element: <PuzzleType title="Queen & Rook Endgame" themes={["queenRookEndgame"]} />
  },
  {
    path: "/train/puzzle/rookEndgame",
    element: <PuzzleType title="Rook Endgame" themes={["rookEndgame"]} />
  },
  {
    path: "/train/puzzle/queenEndgame",
    element: <PuzzleType title="Queen Endgame" themes={["queenEndgame"]} />
  },
  {
    path: "/train/puzzle/knightEndgame",
    element: <PuzzleType title="Knight Endgame" themes={["knightEndgame"]} />
  },
  {
    path: "/train/puzzle/bishopEndgame",
    element: <PuzzleType title="Bishop Endgame" themes={["bishopEndgame"]} />
  },
  {
    path: "/train/puzzle/pawnEndgame",
    element: <PuzzleType title="Pawn Endgame" themes={["pawnEndgame"]} />
  },

  // Lengths
  {
    path: "/train/puzzle/oneMove",
    element: <PuzzleType title="One Move" themes={["oneMove"]} />
  },
  {
    path: "/train/puzzle/short",
    element: <PuzzleType title="Short (2 moves)" themes={["short"]} />
  },
  {
    path: "/train/puzzle/long",
    element: <PuzzleType title="Long (3 moves)" themes={["long"]} />
  },
  {
    path: "/train/puzzle/veryLong",
    element: <PuzzleType title="Very Long (4+ moves)" themes={["veryLong"]} />
  },
  {
    path: "/train/puzzle/attackingF2F7",
    element: <PuzzleType title="Attacking f2/f7" themes={["attackingF2F7"]} />
  },
  {
    path: "/train/puzzle/queensideAttack",
    element: <PuzzleType title="Queenside Attack" themes={["queensideAttack"]} />
  },
  {
    path: "/train/puzzle/kingsideAttack",
    element: <PuzzleType title="Kingside Attack" themes={["kingsideAttack"]} />
  },
  {
    path: "/train/puzzle/quietMove",
    element: <PuzzleType title="Quiet Move" themes={["quietMove"]} />
  },
  {
    path: "/train/puzzle/advancedPawn",
    element: <PuzzleType title="Advanced Pawn" themes={["advancedPawn"]} />
  },
  {
    path: "/train/puzzle/promotion",
    element: <PuzzleType title="Promotion" themes={["promotion"]} />
  },
  {
    path: "/train/puzzle/underPromotion",
    element: <PuzzleType title="Underpromotion" themes={["underPromotion"]} />
  },
  {
    path: "/train/puzzle/enPassant",
    element: <PuzzleType title="En Passant" themes={["enPassant"]} />
  },
  {
    path: "/train/puzzle/interference",
    element: <PuzzleType title="Interference" themes={["interference"]} />
  },
  {
    path: "/train/puzzle/deflection",
    element: <PuzzleType title="Deflection" themes={["deflection"]} />
  },
  {
    path: "/train/puzzle/intermezzo",
    element: <PuzzleType title="Intermezzo (Zwischenzug)" themes={["intermezzo"]} />
  },
  {
    path: "/train/puzzle/clearance",
    element: <PuzzleType title="Clearance" themes={["clearance"]} />
  },
  {
    path: "/train/puzzle/attraction",
    element: <PuzzleType title="Attraction" themes={["attraction"]} />
  },
  {
    path: "/train/puzzle/discoveredAttack",
    element: <PuzzleType title="Discovered Attack" themes={["discoveredAttack"]} />
  },
  {
    path: "/train/puzzle/xRayAttack",
    element: <PuzzleType title="X-Ray Attack" themes={["xRayAttack"]} />
  },
  {
    path: "/train/puzzle/skewer",
    element: <PuzzleType title="Skewer" themes={["skewer"]} />
  },
  {
    path: "/train/puzzle/fork",
    element: <PuzzleType title="Fork" themes={["fork"]} />
  },
  {
    path: "/train/puzzle/pin",
    element: <PuzzleType title="Pin" themes={["pin"]} />
  },
  {
    path: "/train/puzzle/doubleCheck",
    element: <PuzzleType title="Double Check" themes={["doubleCheck"]} />
  },
  {
    path: "/train/puzzle/sacrifice",
    element: <PuzzleType title="Sacrifice" themes={["sacrifice"]} />
  },
  {
    path: "/train/puzzle/trappedPiece",
    element: <PuzzleType title="Trapped Piece" themes={["trappedPiece"]} />
  },
  {
    path: "/train/puzzle/hangingPiece",
    element: <PuzzleType title="Hanging Piece" themes={["hangingPiece"]} />
  },
  {
    path: "/train/puzzle/defensiveMove",
    element: <PuzzleType title="Defensive Move" themes={["defensiveMove"]} />
  },
  {
    path: "/train/puzzle/equality",
    element: <PuzzleType title="Equality" themes={["equality"]} />
  },
  {
    path: "/train/puzzle/capturingDefender",
    element: <PuzzleType title="Capturing Defender" themes={["capturingDefender"]} />
  },
  {
    path: "/train/puzzle/zugzwang",
    element: <PuzzleType title="Zugzwang" themes={["zugzwang"]} />
  },
  {
    path: "/train/puzzle/exposedKing",
    element: <PuzzleType title="Exposed King" themes={["exposedKing"]} />
  },
  {
    path: "/train/puzzle/crushing",
    element: <PuzzleType title="Crushing" themes={["crushing"]} />
  },
  {
    path: "/train/puzzle/master",
    element: <PuzzleType title="Master Level" themes={["master"]} />
  },
  {
    path: "/train/puzzle/superGM",
    element: <PuzzleType title="Super GM Level" themes={["superGM"]} />
  },
  {
    path: "/train/puzzle/masterVsMaster",
    element: <PuzzleType title="Master vs Master" themes={["masterVsMaster"]} />
  },
  {
    path: "/train/puzzle/advantage",
    element: <PuzzleType title="Winning Advantage" themes={["advantage"]} />
  }
];
