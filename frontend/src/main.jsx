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
import Homepage from "./components/Home/Homepage.jsx";
import Admin from "./components/Home/Admin.jsx";
import QRCodePage from "./components/QrCodeUrl.jsx";
import Game1 from "./Pages/Game1.jsx";
import Game2 from "./Pages/Game2.jsx";
import Game3 from "./Pages/Game3.jsx";


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Login />} />
      <Route path="homepage" element={<Homepage />} />
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
        <Route path="/qrcode" element={<QRCodePage />} />
        <Route path="/game1" element={<Game1 />} />
        <Route path="/game2" element={<Game2 />} />
        <Route path="/game3" element={<Game3 />} />
        </>
    )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
