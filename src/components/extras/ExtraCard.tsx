import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Extra } from "../../types";
import { formatPrice } from "../../utils";
import { useNavigate } from "react-router-dom";
import { deleteExtra } from "../../services/Extras.Service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

interface ExtraCardProps {
    extra: Extra;
}

const ExtraCard = ({ extra }: ExtraCardProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteExtra,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["extras"] });
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
                            {extra.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-green-600">{formatPrice(extra.price)}</span>
                            <div className={`w-3 h-3 rounded-full ${extra.isActive ? "bg-green-400" : "bg-red-400"}`}></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(location.pathname + `?viewExtra=${extra._id}`)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 text-blue-600 hover:bg-purple-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Ver detalles"
                            >
                                <EyeIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            <button
                                onClick={() => navigate(location.pathname + `?editExtra=${extra._id}`)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Editar"
                            >
                                <PencilIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            <button
                                onClick={() => mutate({ extraId: extra._id })}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-200 group/btn"
                                title={extra.isActive ? "Desactivar" : "Eliminar"}
                                disabled={isPending}
                            >
                                <TrashIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className={`text-xs font-medium ${extra.isActive ? "text-green-600" : "text-red-600"}`}>
                                {extra.isActive ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    );
};

export default ExtraCard;
