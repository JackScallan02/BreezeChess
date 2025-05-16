import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
  import { ROUTES } from "./route";
  
  export const router = createBrowserRouter(
    createRoutesFromElements(
      ROUTES.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))
    )
  );
  