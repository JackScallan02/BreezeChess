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
  setTheme: (theme: ThemeSetting) => void;
  setPreMoveKey: (value: string | undefined) => void;
  setCountryID: (value: number) => void;
};

const UserDataContext = createContext<UserSettings | undefined>(undefined);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeSetting>("systemDefault");
  const [preMoveKey, setPreMoveKey] = useState<string | undefined>(undefined);
  const [countryID, setCountryID] = useState<number>(-1);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      // When user logs in or changes, refetch settings
      getUserInfo(user.id, "")
        .then((data) => {
          setTheme(data.theme ?? "systemDefault");
          setCountryID(data.country_id ?? -1);
          setPreMoveKey(data.premove ?? undefined);
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
    setTheme,
    setPreMoveKey,
    setCountryID,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  
  useEffect(() => {
    console.log("Context: ", context);
  }, []);

  if (!context) {
    throw new Error("useUserData must be used within a UserSettingsProvider");
  }
  return context;
};
