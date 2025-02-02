import { RouterProvider } from "react-router-dom";
import { router } from "./constants/router/router";

export default function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-r from-sky-100 to-sky-200">
      <RouterProvider router={router} />
    </div>
  );
}

