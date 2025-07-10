// src/constants/router/routes.tsx
import React from 'react';
import FrontPage from "../../pages/FrontPage";
import Login from "../../pages/Login";
import About from "../../pages/About";
import Register from "../../pages/Register";
import Home from "../../pages/Home";
import Welcome from "../../pages/Welcome";
import Profile from "../../pages/Profile";
import SettingsPage from "../../pages/Settings/Settings";
import Store from '../../pages/Store/Store';
import Contact from "../../pages/Contact";
import Train from "../../pages/Train";
import BoardBuilder from "../../pages/BoardBuilder";
import PuzzleHome from "../../pages/PuzzleHome";
import PuzzleType from "../../components/PuzzleType";
import ProtectedRoute from "./protectedroute";

interface Route {
  path: string;
  element: React.JSX.Element;
  requiresAuth: boolean;
  allowNewUser?: boolean;
}

const rawRoutes: Array<Route> = [
  { path: "/", element: <FrontPage />, requiresAuth: false },
  { path: "/login", element: <Login />, requiresAuth: false },
  { path: "/about", element: <About />, requiresAuth: false, allowNewUser: true },
  { path: "/register", element: <Register />, requiresAuth: false },
  { path: "/home", element: <Home />, requiresAuth: true },
  { path: "/welcome", element: <Welcome />, requiresAuth: true, allowNewUser: true },
  { path: "/profile", element: <Profile />, requiresAuth: true },
  { path: "/settings", element: <SettingsPage />, requiresAuth: true },
  { path: "/store", element: <Store />, requiresAuth: false, allowNewUser: true},
  { path: "/contact", element: <Contact />, requiresAuth: false, allowNewUser: true },
  { path: "/train", element: <Train />, requiresAuth: true },
  { path: "/train/board-builder", element: <BoardBuilder />, requiresAuth: true },
  { path: "/train/puzzle", element: <PuzzleHome />, requiresAuth: true },

  ...[
    ["mateIn1"], ["mateIn2"], ["mateIn3"], ["mateIn4"], ["mateIn5"], ["mate"],
    ["anastasiaMate"], ["backRankMate"], ["doubleBishopMate"], ["hookMate"], ["vukovicMate"],
    ["arabianMate"], ["bodenMate"], ["dovetailMate"], ["killBoxMate"], ["smotheredMate"],
    ["opening"], ["castling"], ["middlegame"], ["endgame"], ["queenRookEndgame"], ["rookEndgame"],
    ["queenEndgame"], ["knightEndgame"], ["bishopEndgame"], ["pawnEndgame"],
    ["oneMove"], ["short"], ["long"], ["veryLong"],
    ["attackingF2F7"], ["queensideAttack"], ["kingsideAttack"], ["quietMove"], ["advancedPawn"],
    ["promotion"], ["underPromotion"], ["enPassant"], ["interference"], ["deflection"],
    ["intermezzo"], ["clearance"], ["attraction"], ["discoveredAttack"], ["xRayAttack"],
    ["skewer"], ["fork"], ["pin"], ["doubleCheck"], ["sacrifice"],
    ["trappedPiece"], ["hangingPiece"], ["defensiveMove"], ["equality"], ["capturingDefender"],
    ["zugzwang"], ["exposedKing"], ["crushing"], ["master"], ["superGM"],
    ["masterVsMaster"], ["advantage"]
  ].map(([theme]) => ({
    path: `/train/puzzle/${theme}`,
    element: <PuzzleType title={formatTitle(theme)} themes={[theme]} />,
    requiresAuth: true,
  }))
];

function formatTitle(theme: string) {
  const map: Record<string, string> = {
    mate: "Mate in ?",
    intermezzo: "Intermezzo (Zwischenzug)",
    superGM: "Super GM Level",
    masterVsMaster: "Master vs Master",
    backRankMate: "Back-rank Mate",
    doubleBishopMate: "Double Bishop Mate",
    xRayAttack: "X-Ray Attack"
  };
  return map[theme] || capitalizeWords(theme.replace(/([a-z])([A-Z])/g, "$1 $2"));
}

function capitalizeWords(text: string) {
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

export const ROUTES = rawRoutes.map(({ path, element, requiresAuth, allowNewUser }) => ({
  path,
  element: requiresAuth
    ? <ProtectedRoute requiresAuth={true} allowNewUser={!!allowNewUser}>{element}</ProtectedRoute>
    : element,
  requiresAuth
}));
