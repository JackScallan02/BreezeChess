import FrontPage from "../../pages/FrontPage";
import Login from "../../pages/Login";
import About from "../../pages/About";
import Register from "../../pages/Register";
import Home from "../../pages/Home";
import Welcome from "../../pages/Welcome";
import Profile from "../../pages/Profile";
import Contact from "../../pages/Contact";
import Train from "../../pages/Train";
import BoardBuilder from "../../pages/BoardBuilder";
import React from 'react';

interface Route {
  path: string;
  element: React.JSX.Element
}

export const ROUTES: Array<Route> = [
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
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/train",
    element: <Train />
  },
  {
    path: "/train/board-builder",
    element: <BoardBuilder />
  }
];
