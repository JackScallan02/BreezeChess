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

type UserDataState = {
  theme: ThemeSetting;
  preMoveKey?: string;
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
  dataFetched: boolean;
};

type UserDataContextType = UserDataState & {
  setUserDataField: <K extends keyof UserDataState>(
    key: K,
    value: UserDataState[K]
  ) => void;
  setMultipleUserDataFields: (data: Partial<UserDataState>) => void;
};

const DEFAULT_USER_DATA: UserDataState = {
  theme: "systemDefault",
  preMoveKey: undefined,
  countryID: -1,
  alwaysPromoteQueen: false,
  showLegalMoves: true,
  showBoardBuilderEvalBar: true,
  showBoardBuilderEngineEval: true,
  showMoveTypeLabels: true,
  showPuzzleTimer: true,
  points: 0,
  selectedBoard: null,
  allOwnedBoards: [],
  dataFetched: false,
};

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserDataState>(DEFAULT_USER_DATA);

  const setUserDataField = <K extends keyof UserDataState>(
    key: K,
    value: UserDataState[K]
  ) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  const setMultipleUserDataFields = (data: Partial<UserDataState>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        getUserInfo(user.id, "?include=boards"),
        getBoards(user.id),
      ])
        .then(([userInfo, boards]) => {
          setMultipleUserDataFields({
            theme: userInfo.theme ?? "systemDefault",
            countryID: userInfo.country_id ?? -1,
            preMoveKey: userInfo.premove ?? undefined,
            alwaysPromoteQueen: userInfo.alwaysPromoteQueen,
            showLegalMoves: userInfo.showLegalMoves,
            showBoardBuilderEvalBar: userInfo.showBoardBuilderEvalBar,
            showBoardBuilderEngineEval: userInfo.showBoardBuilderEngineEval,
            showMoveTypeLabels: userInfo.showMoveTypeLabels,
            showPuzzleTimer: userInfo.showPuzzleTimer,
            points: userInfo.points,
            selectedBoard: {
              board_id: userInfo.selected_board_id,
              whiteSquare: userInfo.whiteSquare,
              blackSquare: userInfo.blackSquare,
              rarity: userInfo.board_rarity,
              description: userInfo.board_description,
              acquired_at: userInfo.board_acquired_at,
              board_name: userInfo.board_name,
            },
            allOwnedBoards: boards,
            dataFetched: true,
          });
        })
        .catch((err) => {
          console.error("Failed to fetch user settings:", err);
        });
    } else {
      // Reset to defaults on logout
      setUserData(DEFAULT_USER_DATA);
    }
  }, [user?.id]);

  const value: UserDataContextType = {
    ...userData,
    setUserDataField,
    setMultipleUserDataFields,
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
