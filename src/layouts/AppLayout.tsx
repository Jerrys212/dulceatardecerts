import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { ToastContainer } from "react-toastify";
import Spinner from "../components/Spinner";

const AppLayout = () => {
    const { data, isError, isLoading } = useAuth();

    if (isLoading) return <Spinner />;

    if (isError) return <Navigate to={"/login"} />;

    if (data)
        return (
            <>
                <Header />

                <Outlet />

                <ToastContainer />
            </>
        );
};

export default AppLayout;
