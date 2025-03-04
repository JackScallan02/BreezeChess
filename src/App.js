import { RouterProvider } from "react-router-dom";
import { router } from "./constants/router/router";
import { AuthProvider } from "./contexts/AuthContext";
import useDarkMode from "./darkmode/useDarkMode";



export default function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <AuthProvider>
      <div className="App min-h-screen bg-gradient-to-r from-sky-100 to-sky-200 dark:from-gray-800 dark:to-gray-900 dark:text-white">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

