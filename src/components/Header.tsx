import { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon, UserCircleIcon, TagIcon, ShoppingBagIcon, CurrencyDollarIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { MenuItem } from "../types";

const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const menuItems: MenuItem[] = [
        {
            name: "profile",
            path: "/profile",
            icon: <UserCircleIcon className="w-6 h-6" />,
            label: "Perfil",
        },
        {
            name: "categories",
            path: "/categories",
            icon: <TagIcon className="w-6 h-6" />,
            label: "Categorías",
        },
        {
            name: "products",
            path: "/products",
            icon: <ShoppingBagIcon className="w-6 h-6" />,
            label: "Productos",
        },
        {
            name: "sales",
            path: "/sales",
            icon: <CurrencyDollarIcon className="w-6 h-6" />,
            label: "Ventas",
        },
        {
            name: "reports",
            path: "/reports",
            icon: <ChartBarIcon className="w-6 h-6" />,
            label: "Reportes",
        },
    ];

    return (
        <header className="bg-secondary shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <button
                            onClick={toggleDrawer}
                            className="p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Abrir menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        {/* <div className="ml-4 text-xl font-bold text-gray-800">Mi Aplicación</div> */}
                    </div>
                </div>
            </div>

            {/* Drawer / Menu lateral */}
            <div
                className={`fixed inset-0 flex z-40 transition-opacity ease-linear duration-300 ${
                    isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
                        isDrawerOpen ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={toggleDrawer}
                />

                {/* Drawer panel */}
                <div
                    className={`relative flex-1 flex flex-col max-w-xs w-full bg-secondary transform transition ease-in-out duration-300 ${
                        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {/* Drawer header */}
                    <div className="flex items-center justify-between p-4 border-b border-primary">
                        <h2 className="text-lg font-medium text-white">Menú</h2>
                        <button className="rounded-md text-gray-500 hover:text-gray-700 focus:outline-none" onClick={toggleDrawer}>
                            <span className="sr-only">Cerrar menu</span>
                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Drawer content */}
                    <div className="flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 py-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="flex items-center px-3 py-3 text-base font-medium text-white rounded-md hover:bg-primary group"
                                    onClick={toggleDrawer}
                                >
                                    <div className="mr-4 text-white ">{item.icon}</div>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
