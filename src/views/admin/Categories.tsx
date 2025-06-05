import { PlusIcon } from "@heroicons/react/24/outline";
import CategoryCard from "../../components/categories/CategoryCard";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../../services/Category.Service";
import CategoryDetailModal from "../../components/categories/CategoryDetailModal";
import Spinner from "../../components/Spinner";
import AddCategoryModal from "../../components/categories/AddCategoryModal";
import EditCategoryModal from "../../components/categories/EditCategoryModal";
import { useSocket } from "../../context/useSocket";
import { useEffect } from "react";

const Categories = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isConnected, on, off } = useSocket();

    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
        retry: false,
    });

    useEffect(() => {
        if (!isConnected) return;

        const refreshAllData = () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        };

        const eventsToListen = ["newCategory", "deletedCategory", "updatedCategory"];

        eventsToListen.forEach((event) => {
            on(event, refreshAllData);
        });

        return () => {
            eventsToListen.forEach((event) => {
                off(event);
            });
        };
    }, [on, off, isConnected, queryClient]);

    if (isLoading) return <Spinner />;

    if (data)
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header con título y botón */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
                            <p className="mt-2 text-gray-600">Gestiona y organiza todas las categorías de tu inventario</p>
                        </div>

                        <button
                            onClick={() => navigate(location.pathname + `?addCategory`)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Agregar Categoría
                        </button>
                    </div>

                    {/* Grid de cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {data.map((category) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>

                    {/* Estado vacío si no hay categorías */}
                    {data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <PlusIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay categorías</h3>
                            <p className="text-gray-500 mb-6">Comienza agregando tu primera categoría para organizar tu inventario</p>
                            <button
                                onClick={() => {}}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Crear primera categoría
                            </button>
                        </div>
                    )}
                </div>
                <AddCategoryModal />
                <CategoryDetailModal />
                <EditCategoryModal />
            </div>
        );
};

export default Categories;
