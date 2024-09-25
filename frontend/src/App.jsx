import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom"; // Import createRoutesFromElements
import Layout from "./Layout.jsx";
import Login from "./components/Auth/Login.jsx";
import Admin from "./components/Home/Admin.jsx";
import QRCodePage from "./components/QrCodeUrl.jsx";
import Game1 from "./Pages/Game1.jsx";
import Game2 from "./Pages/Game2.jsx";
import Game3 from "./Pages/Game3.jsx";
import Home from "./components/Home/Home.jsx";
import QrScannerComponent from "./Pages/QrScanner.jsx";
import SuccessPage from "../src/Pages/SuccessPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route index element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/qrcode" element={<QRCodePage />} />
      <Route path="/game1" element={<Game1 />} />
      <Route path="/game2" element={<Game2 />} />
      <Route path="/game3" element={<Game3 />} />
      <Route path="/scan" element={<QrScannerComponent />} />
      <Route path="/successPage" element={<SuccessPage />} />
      <Route
        path="*"
        element={
          <h1 className="text-center text-3xl text-bold">
            Not Found
          </h1>
        }
      />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
