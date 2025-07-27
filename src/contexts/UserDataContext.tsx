import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { getUserInfo } from "../api/users";
import { getBoards } from "../api/boards";
import { useAuth } from "../contexts/AuthContext";

import { Board } from "../types/board";

type ThemeSetting = "light" | "dark" | "systemDefault";

type UserSettings = {
  theme: ThemeSetting;
  preMoveKey?: string | undefined;
  countryID: number;
  alwaysPromoteQueen: boolean;
  showLegalMoves: boolean;
  showBoardBuilderEvalBar: boolean;
  showBoardBuilderEngineEval: boolean;
  showMoveTypeLabels: boolean;
  showPuzzleTimer: boolean;
  points: number;
  selectedBoard: Board | null;
  allOwnedBoards: Array<Board>;
  setTheme: (theme: ThemeSetting) => void;
  setPreMoveKey: (value: string | undefined) => void;
  setCountryID: (value: number) => void;
  setAlwaysPromoteQueen: (value: boolean) => void;
  setShowLegalMoves: (value: boolean) => void;
  setShowBoardBuilderEvalBar: (value: boolean) => void;
  setShowBoardBuilderEngineEval: (value: boolean) => void;
  setShowMoveTypeLabels: (value: boolean) => void;
  setShowPuzzleTimer: (value: boolean) => void;
  setPoints: (value: number) => void;
  setSelectedBoard: (value: Board | null) => void;
  setAllOwnedBoards: (value: Array<Board>) => void;
  dataFetched: boolean;
};

const UserDataContext = createContext<UserSettings | undefined>(undefined);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeSetting>("systemDefault");
  const [preMoveKey, setPreMoveKey] = useState<string | undefined>(undefined);
  const [countryID, setCountryID] = useState<number>(-1);
  const [alwaysPromoteQueen, setAlwaysPromoteQueen] = useState(false);
  const [showLegalMoves, setShowLegalMoves] = useState(true);
  const [showBoardBuilderEvalBar, setShowBoardBuilderEvalBar] = useState(true);
  const [showBoardBuilderEngineEval, setShowBoardBuilderEngineEval] = useState(true);
  const [showMoveTypeLabels, setShowMoveTypeLabels] = useState(true);
  const [showPuzzleTimer, setShowPuzzleTimer] = useState(true);
  const [points, setPoints] = useState(0);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [allOwnedBoards, setAllOwnedBoards] = useState<Board[]>([]);

  const [dataFetched, setDataFetched] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      // When user logs in or changes, refetch settings
      getUserInfo(user.id, "")
        .then((data) => {
          setTheme(data.theme ?? "systemDefault");
          setCountryID(data.country_id ?? -1);
          setPreMoveKey(data.premove ?? undefined);
          setAlwaysPromoteQueen(data.alwaysPromoteQueen);
          setShowLegalMoves(data.showLegalMoves);
          setShowBoardBuilderEvalBar(data.showBoardBuilderEvalBar);
          setShowBoardBuilderEngineEval(data.showBoardBuilderEngineEval);
          setShowMoveTypeLabels(data.showMoveTypeLabels);
          setShowPuzzleTimer(data.showPuzzleTimer);
          setPoints(data.points);
          setSelectedBoard({
            board_id: data.selected_board_id,
            whiteSquare: data.whiteSquare,
            blackSquare: data.blackSquare,
          });
          setDataFetched(true);
        })
        .catch((err) => {
          console.error("Failed to fetch user settings:", err);
        });

      getBoards(user.id).then((data) => {
        setAllOwnedBoards(data);
      });
    } else {
      // When user logs out, reset to defaults
      setTheme("systemDefault");
      setPreMoveKey(undefined);
      setCountryID(-1);
    }
  }, [user?.id]);

  const value: UserSettings = {
    theme,
    preMoveKey,
    countryID,
    alwaysPromoteQueen,
    showLegalMoves,
    showBoardBuilderEvalBar,
    showBoardBuilderEngineEval,
    showMoveTypeLabels,
    showPuzzleTimer,
    points,
    selectedBoard,
    allOwnedBoards,
    setTheme,
    setPreMoveKey,
    setCountryID,
    setAlwaysPromoteQueen,
    setShowLegalMoves,
    setShowBoardBuilderEvalBar,
    setShowBoardBuilderEngineEval,
    setShowMoveTypeLabels,
    setShowPuzzleTimer,
    setPoints,
    setSelectedBoard,
    setAllOwnedBoards,
    dataFetched
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);

  if (!context) {
    throw new Error("useUserData must be used within a UserSettingsProvider");
  }
  return context;
};
