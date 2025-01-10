import { RouterProvider } from "react-router-dom";
import { router } from "./constants/router/router";

export default function App() {
  return (
    <div className="App w-full h-full absolute bg-gradient-to-r from-sky-50 to-sky-100">
      <RouterProvider router={router} />
    </div>
  );
}
