import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./views/auth/Login";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./views/admin/Dashboard";
import Categories from "./views/admin/Categories";
import Products from "./views/admin/Products";
import Sales from "./views/admin/Sales";
import { SocketProvider } from "./context/useSocket";
import { useState } from "react";

function App() {
    const [token, setToken] = useState(sessionStorage.getItem("AUTH_TOKEN"));

    return (
        <BrowserRouter>
            <SocketProvider token={token}>
                <Routes>
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" index element={<Dashboard />} />
                        <Route path="/profile" index element={<Dashboard />} />
                        <Route path="/categories" index element={<Categories />} />
                        <Route path="/products" index element={<Products />} />
                        <Route path="/sales" index element={<Sales />} />
                        <Route path="/reports" index element={<Dashboard />} />
                    </Route>
                </Routes>
            </SocketProvider>
        </BrowserRouter>
    );
}

export default App;
