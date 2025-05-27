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
            description: "Gestionar perfil",
        },
        {
            name: "categories",
            path: "/categories",
            icon: <TagIcon className="w-6 h-6" />,
            label: "Categorías",
            description: "Organizar productos",
        },
        {
            name: "products",
            path: "/products",
            icon: <ShoppingBagIcon className="w-6 h-6" />,
            label: "Productos",
            description: "Catálogo completo",
        },
        {
            name: "sales",
            path: "/sales",
            icon: <CurrencyDollarIcon className="w-6 h-6" />,
            label: "Ventas",
            description: "Historial de ventas",
        },
        {
            name: "reports",
            path: "/reports",
            icon: <ChartBarIcon className="w-6 h-6" />,
            label: "Reportes",
            description: "Análisis y métricas",
        },
    ];

    return (
        <>
            <header className="bg-white shadow-lg border-b border-gray-100 relative z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleDrawer}
                                className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-all duration-200 transform hover:scale-105"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Abrir menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <ShoppingBagIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Dulce Atardecer
                                    </h1>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">JP</span>
                                </div>
                                <div className="hidden md:block text-sm">
                                    <div className="font-medium text-gray-900">Juan Pérez</div>
                                    <div className="text-gray-500">Administrador</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 flex z-50 transition-all ease-in-out duration-300 ${
                    isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
                <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={toggleDrawer}
                />

                <div
                    className={`relative flex flex-col max-w-xs w-full bg-white shadow-2xl transform transition-all ease-in-out duration-300 ${
                        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <ShoppingBagIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Navegación</h2>
                                    <p className="text-blue-100 text-sm">Panel de control</p>
                                </div>
                            </div>
                            <button
                                className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                                onClick={toggleDrawer}
                            >
                                <span className="sr-only">Cerrar menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6">
                        <nav className="px-4 space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="group flex items-center px-4 py-3 text-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
                                    onClick={toggleDrawer}
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-200 mr-4">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{item.label}</div>
                                        <div className="text-xs text-gray-500 group-hover:text-blue-600">{item.description}</div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                </Link>
                            ))}
                        </nav>

                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">JP</span>
                                    </div>
                                    <div className="text-sm text-gray-600">Juan Pérez</div>
                                </div>
                                <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200">Cerrar Sesión</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
