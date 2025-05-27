import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./views/auth/Login";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./views/admin/Dashboard";
import Categories from "./views/admin/Categories";
import Products from "./views/admin/Products";
import Sales from "./views/admin/Sales";

function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;
