import { Link } from "react-router-dom";
import { UserCircleIcon, TagIcon, ShoppingBagIcon, CurrencyDollarIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { MenuCard } from "../../types";
import DashboardCard from "../../components/DashboardCard";
import StatCard from "../../components/StatCard";

const Dashboard = () => {
    const menuCards: MenuCard[] = [
        {
            name: "profile",
            path: "/profile",
            icon: <UserCircleIcon className="w-10 h-10" />,
            label: "Perfil",
            description: "Administra tu información personal y configuración",
            bgColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
            textColor: "text-white",
        },
        {
            name: "categories",
            path: "/categories",
            icon: <TagIcon className="w-10 h-10" />,
            label: "Categorías",
            description: "Organiza y gestiona todas tus categorías",
            bgColor: "bg-gradient-to-br from-green-400 to-cyan-500",
            textColor: "text-white",
        },
        {
            name: "products",
            path: "/products",
            icon: <ShoppingBagIcon className="w-10 h-10" />,
            label: "Productos",
            description: "Explora y administra tu inventario de productos",
            bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500",
            textColor: "text-white",
        },
        {
            name: "extras",
            path: "/extras",
            icon: <ShoppingBagIcon className="w-10 h-10" />,
            label: "Extras",
            description: "Explora y administra tu inventario de extras",
            bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
            textColor: "text-white",
        },
        {
            name: "sales",
            path: "/sales",
            icon: <CurrencyDollarIcon className="w-10 h-10" />,
            label: "Ventas",
            description: "Visualiza y gestiona todas tus transacciones",
            bgColor: "bg-gradient-to-br from-red-500 to-pink-600",
            textColor: "text-white",
        },
        {
            name: "reports",
            path: "/reports",
            icon: <ChartBarIcon className="w-10 h-10" />,
            label: "Reportes",
            description: "Analiza tu rendimiento con estadísticas detalladas",
            bgColor: "bg-gradient-to-br from-blue-500 to-violet-600",
            textColor: "text-white",
        },
    ];

    const statsItems = [
        {
            title: "Productos",
            value: "245",
            icon: <ShoppingBagIcon className="w-8 h-8" />,
            iconColor: "text-blue-500",
        },
        {
            title: "Categorías",
            value: "18",
            icon: <TagIcon className="w-8 h-8" />,
            iconColor: "text-green-500",
        },
        {
            title: "Ventas hoy",
            value: "$2,845",
            icon: <CurrencyDollarIcon className="w-8 h-8" />,
            iconColor: "text-pink-500",
        },
        {
            title: "Crecimiento",
            value: "+24%",
            icon: <ChartBarIcon className="w-8 h-8" />,
            iconColor: "text-purple-500",
            valueColor: "text-green-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Panel de Control</h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">Gestiona tu negocio desde un solo lugar</p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {menuCards.map((card) => (
                        <Link key={card.name} to={card.path} className="group transform transition-all duration-300 hover:-translate-y-2">
                            <DashboardCard
                                key={card.name}
                                icon={card.icon}
                                label={card.label}
                                description={card.description}
                                bgColor={card.bgColor}
                                textColor={card.textColor}
                            />
                        </Link>
                    ))}
                </div>

                {/* Resumen de estadísticas */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen rápido</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {statsItems.map((stat, index) => (
                            <StatCard
                                key={index}
                                icon={stat.icon}
                                title={stat.title}
                                value={stat.value}
                                iconColor={stat.iconColor}
                                valueColor={stat.valueColor}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
