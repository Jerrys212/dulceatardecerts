import { PlusIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import SaleCard from "../../components/sales/SaleCard";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import { getSales } from "../../services/Sale.Service";
import AddSaleModal from "../../components/sales/AddSaleModal";
import { getCategories } from "../../services/Category.Service";
import { useNavigate } from "react-router-dom";

const SalesPage = () => {
    const navigate = useNavigate();
    // Calcular estadísticas
    // const totalVentas = salesToShow.length;
    // const totalIngresos = salesToShow.reduce((sum, sale) => sum + sale.total, 0);
    // const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;
    // const ventasHoy = salesToShow.filter((sale) => {
    //     const today = new Date().toDateString();
    //     const saleDate = new Date(sale.createdAt).toDateString();
    //     return today === saleDate;
    // }).length;

    // const formatPrice = (price: number) => {
    //     return new Intl.NumberFormat("es-MX", {
    //         style: "currency",
    //         currency: "MXN",
    //     }).format(price);
    // };

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        retry: false,
    });

    const { data: salesToShow, isLoading } = useQuery({
        queryKey: ["sales"],
        queryFn: getSales,
        retry: false,
    });

    if (isLoading) return <Spinner />;

    if (salesToShow)
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header con título y botón */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
                            <p className="mt-2 text-gray-600">Gestiona y visualiza todas las transacciones de tu negocio</p>
                        </div>

                        <button
                            onClick={() => navigate(location.pathname + `?addSale`)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105 transition-all duration-200"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Nueva Venta
                        </button>
                    </div>

                    {/* Estadísticas rápidas */}
                    {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Ingresos Totales</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{formatPrice(totalIngresos)}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ShoppingCartIcon className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Ventas</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{totalVentas}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Ventas Hoy</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{ventasHoy}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-lg rounded-xl p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Promedio</dt>
                                    <dd className="text-2xl font-bold text-gray-900">{formatPrice(promedioVenta)}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div> */}

                    {/* Grid de cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {salesToShow.map((sale) => (
                            <SaleCard key={sale._id} sale={sale} />
                        ))}
                    </div>

                    {/* Estado vacío si no hay ventas */}
                    {salesToShow.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <CurrencyDollarIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
                            <p className="text-gray-500 mb-6">Comienza registrando tu primera venta para comenzar a vender</p>
                            <button
                                onClick={() => {}}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Registrar primera venta
                            </button>
                        </div>
                    )}
                </div>

                <AddSaleModal categories={categories} />
            </div>
        );
};

export default SalesPage;
