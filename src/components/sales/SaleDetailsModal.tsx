import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon, ShoppingCartIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import { getSaleById } from "../../services/Sale.Service";
import { formatDate, formatPrice } from "../../utils";

export default function SaleDetailModal() {
    const saleId = new URLSearchParams(useLocation().search).get("viewSale") || "";
    const navigate = useNavigate();

    const {
        data: sale,
        isError,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["sale", saleId],
        queryFn: () => getSaleById({ saleId }),
        enabled: !!saleId,
        retry: false,
    });

    if (isLoading) return <Spinner />;

    const handleClose = () => navigate(location.pathname, { replace: true });

    if (isError) {
        toast.error(error.message, { toastId: "error" });
        handleClose();
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Cerrada":
                return "bg-green-100 text-green-800 border-green-300";
            case "En proceso":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Cancelada":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Cerrada":
                return <CheckCircleIcon className="h-5 w-5" />;
            case "En proceso":
                return <ClockIcon className="h-5 w-5" />;
            case "Cancelada":
                return <XCircleIcon className="h-5 w-5" />;
            default:
                return <ClockIcon className="h-5 w-5" />;
        }
    };

    if (sale)
        return (
            <Transition appear show={!!saleId} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={handleClose}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all">
                                    {/* Header compacto */}
                                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 text-white">
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={handleClose}
                                                className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-white/20 rounded-xl">
                                                    <ShoppingCartIcon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <DialogTitle as="h3" className="text-2xl font-bold">
                                                        ORDEN #{sale.customer}
                                                    </DialogTitle>
                                                    <p className="mt-1 text-orange-100">Vendedor: {sale.seller.username}</p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div
                                                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${getStatusColor(
                                                        sale.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(sale.status)}
                                                    <span className="text-sm font-bold">{sale.status.toUpperCase()}</span>
                                                </div>
                                                <div className="text-white text-xs mt-1">{formatDate(sale.createdAt)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-4">
                                        {/* PRODUCTOS - SECCIÓN PRINCIPAL */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xl font-bold text-gray-900 flex items-center">
                                                    <ListBulletIcon className="h-5 w-5 mr-2 text-orange-600" />
                                                    PRODUCTOS A PREPARAR ({sale.items.length})
                                                </h4>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-purple-600">{formatPrice(sale.total)}</div>
                                                    <div className="text-xs text-gray-500">Total orden</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                                {sale.items.map((item, index) => (
                                                    <div key={index} className="bg-white border-2 border-purple-200 rounded-lg p-4 shadow-md">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1">
                                                                {/* Categoría PRIMERO y más destacada */}
                                                                <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg mb-2">
                                                                    <div className="font-black text-lg uppercase">{item.product.category.name}</div>
                                                                    {item.product.subCategory && (
                                                                        <div className="text-sm font-medium">• {item.product.subCategory}</div>
                                                                    )}
                                                                </div>

                                                                {/* Nombre del producto (sabor/tipo) */}
                                                                <div className="flex items-center space-x-2 mb-2">
                                                                    <div className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">
                                                                        {index + 1}
                                                                    </div>
                                                                    <h6 className="font-bold text-lg text-gray-900">{item.name}</h6>
                                                                    {!item.product.isActive && (
                                                                        <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                                                            INACTIVO
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Cantidad destacada pero más compacta */}
                                                                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2 text-center">
                                                                    <div className="text-xl font-black text-blue-600">CANTIDAD: {item.quantity}</div>
                                                                </div>

                                                                {/* Descripción compacta */}
                                                                {item.product.description && (
                                                                    <div className="bg-gray-50 rounded p-2 mb-2">
                                                                        <div className="font-medium text-gray-700 text-xs uppercase">
                                                                            Descripción:
                                                                        </div>
                                                                        <p className="text-gray-800 text-sm">{item.product.description}</p>
                                                                    </div>
                                                                )}

                                                                {/* EXTRAS - Compactos pero visibles */}
                                                                {item.extras && item.extras.length > 0 && (
                                                                    <div className="bg-yellow-50 border border-yellow-300 rounded p-2">
                                                                        <div className="font-bold text-yellow-800 text-sm uppercase mb-1">
                                                                            ⚠️ Especificaciones:
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            {item.extras.map((extra, extraIndex) => (
                                                                                <div
                                                                                    key={extraIndex}
                                                                                    className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded text-sm font-medium"
                                                                                >
                                                                                    • {extra}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Precio compacto */}
                                                            <div className="text-right ml-3">
                                                                <div className="bg-green-50 border border-green-200 rounded p-2 text-center min-w-[80px]">
                                                                    <div className="text-xs text-gray-600">Unit.</div>
                                                                    <div className="text-sm font-bold text-green-600">{formatPrice(item.price)}</div>
                                                                    <div className="text-xs text-gray-600 mt-1">Total</div>
                                                                    <div className="text-lg font-bold text-green-600">
                                                                        {formatPrice(item.subtotal)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Información adicional (minimizada) */}
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                <div className="bg-blue-50 rounded-lg p-2">
                                                    <div className="font-medium text-blue-900 text-xs">Fecha creación</div>
                                                    <div className="text-blue-700 text-xs">{formatDate(sale.createdAt)}</div>
                                                </div>

                                                <div className="bg-amber-50 rounded-lg p-2">
                                                    <div className="font-medium text-amber-900 text-xs">Última actualización</div>
                                                    <div className="text-amber-700 text-xs">{formatDate(sale.updatedAt)}</div>
                                                </div>

                                                {sale.statusUpdatedBy && (
                                                    <div className="bg-indigo-50 rounded-lg p-2">
                                                        <div className="font-medium text-indigo-900 text-xs">Estado por</div>
                                                        <div className="text-indigo-700 text-xs">{sale.statusUpdatedBy.username}</div>
                                                    </div>
                                                )}

                                                {sale.statusUpdatedAt && (
                                                    <div className="bg-teal-50 rounded-lg p-2">
                                                        <div className="font-medium text-teal-900 text-xs">Estado actualizado</div>
                                                        <div className="text-teal-700 text-xs">{formatDate(sale.statusUpdatedAt)}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
}
