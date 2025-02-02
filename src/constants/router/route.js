import Home from "../../pages/Home";
import Login from "../../pages/Login";
import About from "../../pages/About";
import Register from "../../pages/Register";

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
  {
    path: "/register",
    element: <Register />,
  },
];
