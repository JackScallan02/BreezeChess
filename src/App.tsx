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
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}`);
        if (!res.ok) {
          console.warn("Server responded but not ready");
          setServerReady(false);
        }
      } catch (err) {
        console.warn("Server unreachable", err);
        setServerReady(false);
      }
    };

    checkServer();
  }, []);

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
