import FrontPage from "../../pages/FrontPage";
import Login from "../../pages/Login";
import About from "../../pages/About";
import Register from "../../pages/Register";
import Home from "../../pages/Home";
import Welcome from "../../pages/Welcome";
import Contact from "../../pages/Contact";

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
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
];
