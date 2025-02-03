import FrontPage from "../../pages/FrontPage";
import Login from "../../pages/Login";
import About from "../../pages/About";
import Register from "../../pages/Register";
import Home from "../../pages/Home";

export const ROUTES = [
  {
    path: "/",
    element: <FrontPage />,
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
  {
    path: "/home",
    element: <Home />,
  },
];
