import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { getUserInfo } from "../api/users";
import { useAuth } from "../contexts/AuthContext";

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
  setTheme: (theme: ThemeSetting) => void;
  setPreMoveKey: (value: string | undefined) => void;
  setCountryID: (value: number) => void;
  setAlwaysPromoteQueen: (value: boolean) => void;
  setShowLegalMoves: (value: boolean) => void;
  setShowBoardBuilderEvalBar: (value: boolean) => void;
  setShowBoardBuilderEngineEval: (value: boolean) => void;
  setShowMoveTypeLabels: (value: boolean) => void;
  setShowPuzzleTimer: (value: boolean) => void;

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

          setDataFetched(true);
        })
        .catch((err) => {
          console.error("Failed to fetch user settings:", err);
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
    setTheme,
    setPreMoveKey,
    setCountryID,
    setAlwaysPromoteQueen,
    setShowLegalMoves,
    setShowBoardBuilderEvalBar,
    setShowBoardBuilderEngineEval,
    setShowMoveTypeLabels,
    setShowPuzzleTimer,
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

  console.log("Context: ", context);

  if (!context) {
    throw new Error("useUserData must be used within a UserSettingsProvider");
  }
  return context;
};
