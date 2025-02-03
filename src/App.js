import { RouterProvider } from "react-router-dom";
import { router } from "./constants/router/router";
import { AuthProvider } from "./contexts/AuthContext";


export default function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-gradient-to-r from-sky-100 to-sky-200">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

