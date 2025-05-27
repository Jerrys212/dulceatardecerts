import { EyeIcon, PencilIcon, TagIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Product } from "../../types";
import { formatPrice } from "../../utils";
import { useNavigate } from "react-router-dom";
import { deleteProduct } from "../../services/Products.Service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteProduct,
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
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                            {product.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
                            <div className={`w-3 h-3 rounded-full ${product.isActive ? "bg-green-400" : "bg-red-400"}`}></div>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{product.description}</p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <TagIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">{product.category.name}</span>
                        </div>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">{product.subCategory}</span>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    {/* Botones de acción */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(location.pathname + `?viewProduct=${product._id}`)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Ver detalles"
                            >
                                <EyeIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            <button
                                onClick={() => navigate(location.pathname + `?editProduct=${product._id}`)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Editar"
                            >
                                <PencilIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            <button
                                onClick={() => mutate({ productId: product._id })}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Eliminar"
                            >
                                <TrashIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                        </div>

                        {/* Indicador de estado */}
                        <span className={`text-xs font-medium ${product.isActive ? "text-green-600" : "text-red-600"}`}>
                            {product.isActive ? "Activo" : "Inactivo"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Elemento decorativo */}
            <div className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    );
};

export default ProductCard;
