import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Login from "./components/Auth/Login.jsx";
import App from "./App.jsx";
import "./index.css";
import Admin from "./Pages/Admin.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Login />} />
            <Route
                path="*"
                element={
                  <h1 className="text-center text-3xl text-bold">
                        Not Found
                    </h1>
                }
            />
        </Route>
        <Route path="/admin" element={<Admin />} />
        </>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
