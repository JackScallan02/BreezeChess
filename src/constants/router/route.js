import Home from "../../pages/Home";
import Login from "../../pages/Login";
import About from "../../pages/About";

export const ROUTES = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/about",
    element: <About />,
  },
];
