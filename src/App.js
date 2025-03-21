import { RouterProvider } from "react-router-dom";
import { router } from "./constants/router/router";
import { AuthProvider } from "./contexts/AuthContext";
import { PrimeReactProvider } from 'primereact/api';
import { React } from 'react';
import "primereact/resources/themes/lara-light-blue/theme.css";  // Or any other theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";


export default function App() {

  return (
    <AuthProvider>
      <PrimeReactProvider>
        <div className="App min-h-screen bg-linear-to-r from-sky-100 to-sky-200 dark:from-gray-800 dark:to-gray-900 dark:text-white">
          <RouterProvider router={router} />
        </div>
      </PrimeReactProvider>
    </AuthProvider>
  );
}

