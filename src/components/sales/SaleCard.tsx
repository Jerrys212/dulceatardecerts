import {
    CalendarDaysIcon,
    EyeIcon,
    PencilIcon,
    ShoppingCartIcon,
    UserIcon,
    CheckIcon,
    XMarkIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { formatDate, formatPrice } from "../../utils";
import { Sale } from "../../types";
import { useNavigate } from "react-router-dom";

type SaleCardProps = {
    sale: Sale;
};

// Configuración simple para estados
const getStatusConfig = (status: string) => {
    switch (status) {
        case "En proceso":
            return {
                badge: "bg-yellow-100 text-yellow-800 border border-yellow-300",
                icon: ClockIcon,
                label: "En Proceso",
                color: "text-yellow-600",
                indicator: "from-yellow-500 to-orange-500",
            };
        case "Cerrada":
            return {
                badge: "bg-green-100 text-green-800 border border-green-300",
                icon: CheckCircleIcon,
                label: "Completada",
                color: "text-green-600",
                indicator: "from-green-500 to-emerald-500",
            };
        case "Cancelada":
            return {
                badge: "bg-red-100 text-red-800 border border-red-300",
                icon: XCircleIcon,
                label: "Cancelada",
                color: "text-red-600",
                indicator: "from-red-500 to-rose-500",
            };
        default:
            return {
                badge: "bg-gray-100 text-gray-800 border border-gray-300",
                icon: ClockIcon,
                label: status || "Sin estado",
                color: "text-gray-600",
                indicator: "from-gray-500 via-gray-600 to-gray-500",
            };
    }
};

// Componente para cada card de venta
const SaleCard = ({ sale }: SaleCardProps) => {
    const navigate = useNavigate();
    const statusConfig = getStatusConfig(sale.status);
    const StatusIcon = statusConfig.icon;

    const getTotalItems = () => {
        return sale.items.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <UserIcon className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                {sale.customer}
                            </h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span>{formatDate(sale.createdAt)}</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-1">{formatPrice(sale.total)}</div>
                        <div className="text-xs text-gray-500">Total de venta</div>

                        {/* Badge de estatus mejorado */}
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-1 ${statusConfig.badge}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                        </div>
                    </div>
                </div>

                {/* Información de productos */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <ShoppingCartIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">
                                {sale.items.length} producto{sale.items.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">
                            {getTotalItems()} unidad{getTotalItems() !== 1 ? "es" : ""}
                        </span>
                    </div>

                    {/* Lista de productos */}
                    <div className="space-y-1">
                        {sale.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 truncate">
                                    {item.quantity}x {item.name}
                                </span>
                                <span className="text-gray-700 font-medium">{formatPrice(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Información del vendedor */}
                <div className="bg-purple-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-xs font-medium">{sale.seller.username.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <div className="text-xs text-purple-600 font-medium">Vendedor</div>
                            <div className="text-sm text-purple-800 truncate max-w-[150px]">{sale.seller.username}</div>
                        </div>
                    </div>
                </div>

                {/* Línea divisoria */}
                <div className="border-t border-gray-100 pt-4">
                    {/* Botones de acción dinámicos */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(location.pathname + `?viewSale=${sale._id}`)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Ver detalles"
                            >
                                <EyeIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            {sale.status === "En proceso" && (
                                <>
                                    <button
                                        onClick={() => navigate(location.pathname + `?editSale=${sale._id}`)}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition-all duration-200 group/btn"
                                        title="Editar"
                                    >
                                        <PencilIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                                    </button>
                                    <button
                                        onClick={() => navigate(`${location.pathname}?updateSaleStatus=${sale._id}&status=Cerrada`)}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:scale-105 transition-all duration-200 group/btn"
                                        title="Marcar como completada"
                                    >
                                        <CheckIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                                    </button>

                                    <button
                                        onClick={() => navigate(`${location.pathname}?updateSaleStatus=${sale._id}&status=Cancelada`)}
                                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-200 group/btn"
                                        title="Cancelar venta"
                                    >
                                        <XMarkIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Estado visual mejorado */}
                        <div className="flex items-center space-x-2">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    statusConfig.color === "text-yellow-600"
                                        ? "bg-yellow-500"
                                        : statusConfig.color === "text-green-600"
                                        ? "bg-green-500"
                                        : statusConfig.color === "text-red-600"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                }`}
                            ></div>
                            <span className={`text-sm font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra inferior con color según estado */}
            <div
                className={`h-1 bg-gradient-to-r ${statusConfig.indicator} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
            ></div>
        </div>
    );
};

export default SaleCard;
