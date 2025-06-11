import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon, ShoppingCartIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ListBulletIcon, CubeIcon } from "@heroicons/react/24/outline";
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

    const getExtrasPrice = (item: any) => {
        if (!item.extras || item.extras.length === 0) return 0;
        return item.extras.reduce((total: number, extra: any) => total + extra.price * item.quantity, 0);
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
                                                    <p className="mt-1 text-blue-100">Vendedor: {sale.seller.username}</p>
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
                                                    <ListBulletIcon className="h-5 w-5 mr-2 text-blue-600" />
                                                    PRODUCTOS A PREPARAR ({sale.items.length})
                                                </h4>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-lg border-2 border-purple-200">
                                                        {formatPrice(sale.total)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">Total orden</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {sale.items.map((item, index) => (
                                                    <div key={index} className="bg-white border-2 border-blue-200 rounded-xl p-5 shadow-lg">
                                                        <div className="mb-4">
                                                            {/* Categoría PRIMERO y más destacada */}
                                                            <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-xl mb-3">
                                                                <div className="font-black text-xl uppercase">{item.product.category.name}</div>
                                                                {item.product.subCategory && (
                                                                    <div className="text-sm font-medium">• {item.product.subCategory}</div>
                                                                )}
                                                            </div>

                                                            {/* Nombre del producto (sabor/tipo) */}
                                                            <div className="flex items-center space-x-3 mb-3">
                                                                <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                                    {index + 1}
                                                                </div>
                                                                <h6 className="font-bold text-xl text-gray-900">{item.name}</h6>
                                                                {!item.product.isActive && (
                                                                    <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                                                                        INACTIVO
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Cantidad destacada */}
                                                            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 mb-3 text-center">
                                                                <div className="text-2xl font-black text-green-600">CANTIDAD: {item.quantity}</div>
                                                            </div>

                                                            {/* Descripción compacta */}
                                                            {item.product.description && (
                                                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                                    <div className="font-bold text-gray-700 text-xs uppercase mb-1">Descripción:</div>
                                                                    <p className="text-gray-800 text-sm">{item.product.description}</p>
                                                                </div>
                                                            )}

                                                            {/* EXTRAS - Información resumida */}
                                                            {item.extras && item.extras.length > 0 && (
                                                                <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 mb-3">
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <div className="flex items-center space-x-2">
                                                                            <CubeIcon className="h-5 w-5 text-purple-600" />
                                                                            <div className="font-bold text-purple-800 text-sm uppercase">
                                                                                Extras Agregados:
                                                                            </div>
                                                                        </div>
                                                                        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">
                                                                            +{formatPrice(getExtrasPrice(item))} TOTAL
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {item.extras.map((extra: any, extraIndex: number) => (
                                                                            <div
                                                                                key={extraIndex}
                                                                                className="bg-white border border-purple-200 rounded-lg px-3 py-2 flex items-center space-x-2"
                                                                            >
                                                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                                                <span className="font-medium text-purple-900 text-sm">
                                                                                    {extra.name}
                                                                                </span>
                                                                                <span className="text-purple-600 text-xs font-medium">
                                                                                    +{formatPrice(extra.price)}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Resumen de precios al final */}
                                                            <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-center">
                                                                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                                                    <span>Precio unitario:</span>
                                                                    <span className="font-semibold">{formatPrice(item.price)}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                                                    <span>Cantidad:</span>
                                                                    <span className="font-semibold">× {item.quantity}</span>
                                                                </div>
                                                                {getExtrasPrice(item) > 0 && (
                                                                    <div className="flex justify-between items-center text-sm text-purple-600 mb-2">
                                                                        <span>Extras:</span>
                                                                        <span className="font-semibold">+{formatPrice(getExtrasPrice(item))}</span>
                                                                    </div>
                                                                )}
                                                                <div className="border-t border-gray-300 pt-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-lg font-bold text-gray-900">SUBTOTAL:</span>
                                                                        <span className="text-xl font-black text-green-600">
                                                                            {formatPrice(item.subtotal)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Información adicional (minimizada) */}
                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                <div className="bg-blue-50 rounded-lg p-3">
                                                    <div className="font-medium text-blue-900 text-xs uppercase">Fecha creación</div>
                                                    <div className="text-blue-700 text-sm font-medium">{formatDate(sale.createdAt)}</div>
                                                </div>

                                                <div className="bg-amber-50 rounded-lg p-3">
                                                    <div className="font-medium text-amber-900 text-xs uppercase">Última actualización</div>
                                                    <div className="text-amber-700 text-sm font-medium">{formatDate(sale.updatedAt)}</div>
                                                </div>

                                                {sale.statusUpdatedBy && (
                                                    <div className="bg-indigo-50 rounded-lg p-3">
                                                        <div className="font-medium text-indigo-900 text-xs uppercase">Estado por</div>
                                                        <div className="text-indigo-700 text-sm font-medium">{sale.statusUpdatedBy.username}</div>
                                                    </div>
                                                )}

                                                {sale.statusUpdatedAt && (
                                                    <div className="bg-teal-50 rounded-lg p-3">
                                                        <div className="font-medium text-teal-900 text-xs uppercase">Estado actualizado</div>
                                                        <div className="text-teal-700 text-sm font-medium">{formatDate(sale.statusUpdatedAt)}</div>
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
