import { RouterProvider } from "react-router-dom";
import { router } from "./constants/router/router";
import { AuthProvider } from "./contexts/AuthContext";
import { PrimeReactProvider } from "primereact/api";
import React, { useEffect, useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { UserSettingsProvider } from "./contexts/UserDataContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9001";

export default function App() {
  // Start optimistically assuming the server is ready
  const [serverReady, setServerReady] = useState(true);

  useEffect(() => {
    let intervalId: number | null = null;

    const checkServer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}`, { cache: "no-store" });
        if (res.ok) {
          setServerReady(true);
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        } else {
          setServerReady(false);
        }
      } catch (err) {
        setServerReady(false);
      }
    };

    // Run first check
    checkServer();

    // Only start retry loop if server is not ready
    if (!serverReady) {
      intervalId = setInterval(checkServer, 3000) as unknown as number;
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [serverReady]);

  if (!serverReady) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <UserSettingsProvider>
        <PrimeReactProvider>
          <div className="App min-h-screen bg-gradient-to-r from-white to-sky-300 dark:from-gray-800 dark:to-gray-900 dark:text-white">
            <RouterProvider router={router} />
          </div>
        </PrimeReactProvider>
      </UserSettingsProvider>
    </AuthProvider>
  );
}
