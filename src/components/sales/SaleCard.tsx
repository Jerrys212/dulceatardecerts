import { CalendarDaysIcon, EyeIcon, PencilIcon, ShoppingCartIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { formatDate, formatPrice } from "../../utils";
import { Sale } from "../../types";

type SaleCardProps = {
    sale: Sale;
};

// Componente para cada card de venta
const SaleCard = ({ sale }: SaleCardProps) => {
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

                    {/* Lista de productos (máximo 2 visibles) */}
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
                    {/* Botones de acción */}
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {}}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Ver detalles"
                            >
                                <EyeIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            <button
                                onClick={() => {}}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Editar"
                            >
                                <PencilIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>

                            <button
                                onClick={() => {}}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 transition-all duration-200 group/btn"
                                title="Eliminar"
                            >
                                <TrashIcon className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Elemento decorativo */}
            <div className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    );
};

export default SaleCard;
