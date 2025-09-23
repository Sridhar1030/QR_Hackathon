import {
    createBrowserRouter,
    RouterProvider,
    Route,
    createRoutesFromElements,
} from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute component
import NotFoundPage from "./Pages/NotFoundPage.jsx";
import SignupPage from "./components/Auth/SignupPage.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import UserList from "./components/UserList.jsx";
import Admin1 from './Pages/Admin.jsx'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            {/* Public Route */}
            <Route index element={<Login />} />

            {/* Protected Routes - accessible by both 'user' and 'admin' */}
            <Route
                path="/home"
                element={<ProtectedRoute element={<Home />} />}
            />
            <Route
                path="/qrcode"
                element={<ProtectedRoute element={<QRCodePage />} />}
            />
            <Route
                path="/game1"
                element={<ProtectedRoute element={<Game1 />} />}
            />
            <Route
                path="/game2"
                element={<ProtectedRoute element={<Game2 />} />}
            />
            <Route
                path="/game3"
                element={<ProtectedRoute element={<Game3 />} />}
            />

            {/* Admin-only routes */}
            <Route
                path="/scan"
                element={
                    <ProtectedRoute
                        element={<QrScannerComponent />}
                        allowedRoles={["admin"]}
                    />
                }
            />
            <Route
                path="/Signup"
                element={
                    <ProtectedRoute
                        element={<SignupPage />}
                        allowedRoles={["admin"]}
                    />
                }
            />
            <Route
                path="/userlist"
                element={
                    <ProtectedRoute
                        element={<UserList />}
                        allowedRoles={["admin"]}
                    />
                }
            />
            <Route
                path="/successPage"
                element={
                    <ProtectedRoute
                        element={<SuccessPage />}
                        allowedRoles={["admin"]}
                    />
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        element={<Admin />}
                        allowedRoles={["admin"]}
                    />
                }
            />
            <Route
                path="/adminDash"
                element={
                    <ProtectedRoute
                        element={<Admin1/>}
                        allowedRoles={["admin"]}
                    />
                }
            />

            {/* Catch-all for undefined routes */}
            <Route
                path="*"
                element={
                    <NotFoundPage />
                }
            />
        </Route>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
