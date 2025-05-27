import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Category } from "../../types";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../../services/Category.Service";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

interface CategoryCardProps {
    category: Category;
}

// Componente para cada card de categoría
const CategoryCard = ({ category }: CategoryCardProps) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        mutate,

        isPending,
    } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });

            toast.success(data.message);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    if (isPending) return <Spinner />;

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{category.name}</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{category.description}</p>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(location.pathname + `?viewCategory=${category._id}`)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Ver detalles"
                            >
                                <EyeIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            <button
                                onClick={() => navigate(location.pathname + `?editCategory=${category._id}`)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Editar"
                            >
                                <PencilIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            <button
                                onClick={() => mutate(category._id)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Eliminar"
                            >
                                <TrashIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                        </div>

                        <span className="text-xs text-gray-400 font-medium">Activa</span>
                    </div>
                </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    );
};
export default CategoryCard;
