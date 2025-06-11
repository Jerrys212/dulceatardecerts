import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./views/auth/Login";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./views/admin/Dashboard";
import Categories from "./views/admin/Categories";
import Products from "./views/admin/Products";
import Sales from "./views/admin/Sales";
import { SocketProvider } from "./context/useSocket";
import Reports from "./views/admin/Reports";
import UserProfile from "./views/admin/Profile";
import Extras from "./views/admin/Extras";

function App() {
    const token = localStorage.getItem("AUTH_TOKEN");

    return (
        <BrowserRouter>
            <SocketProvider token={token}>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" index element={<Dashboard />} />
                        <Route path="/profile" index element={<UserProfile />} />
                        <Route path="/categories" index element={<Categories />} />
                        <Route path="/products" index element={<Products />} />
                        <Route path="/extras" index element={<Extras />} />
                        <Route path="/sales" index element={<Sales />} />
                        <Route path="/reports" index element={<Reports />} />
                    </Route>
                </Routes>
            </SocketProvider>
        </BrowserRouter>
    );
}

export default App;
