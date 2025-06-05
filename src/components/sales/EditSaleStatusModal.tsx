import { Fragment, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import {
    XMarkIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    UserIcon,
    CalendarDaysIcon,
    ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getSaleById, updateSaleStatus } from "../../services/Sale.Service";
import { formatPrice, formatDate } from "../../utils";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../Spinner";

// Tipos para los estados
type SaleStatus = "En proceso" | "Cerrada" | "Cancelada";

// Configuración por status
const STATUS_CONFIG: Record<
    SaleStatus,
    {
        color: string;
        bgColor: string;
        textColor: string;
        borderColor: string;
        buttonColor: string;
        icon: React.ComponentType<any>;
        title: string;
        message: string;
        confirmText: string;
        emoji: string;
    }
> = {
    "En proceso": {
        color: "from-yellow-500 to-orange-500",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
        buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        icon: ClockIcon,
        title: "Cambiar a En Proceso",
        message: "La venta será marcada como en proceso de preparación",
        confirmText: "Sí, marcar en proceso",
        emoji: "⏳",
    },
    Cerrada: {
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        borderColor: "border-green-300",
        buttonColor: "bg-green-600 hover:bg-green-700",
        icon: CheckCircleIcon,
        title: "Completar Venta",
        message: "La venta será marcada como completada y lista para entrega",
        confirmText: "Sí, completar venta",
        emoji: "✅",
    },
    Cancelada: {
        color: "from-red-500 to-rose-500",
        bgColor: "bg-red-50",
        textColor: "text-red-800",
        borderColor: "border-red-300",
        buttonColor: "bg-red-600 hover:bg-red-700",
        icon: XCircleIcon,
        title: "Cancelar Venta",
        message: "Esta acción cancelará la venta y no se puede deshacer",
        confirmText: "Sí, cancelar venta",
        emoji: "❌",
    },
};

export default function StatusChangeModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const saleId = queryParams.get("updateSaleStatus") || "";
    const targetStatus = queryParams.get("status") || "";
    const show = queryParams.has("updateSaleStatus");

    const queryClient = useQueryClient();
    const [reason, setReason] = useState("");

    const isValidSaleStatus = (status: string): status is SaleStatus => {
        return ["En proceso", "Cerrada", "Cancelada"].includes(status);
    };

    if (!isValidSaleStatus(targetStatus) && show) {
        console.error("Status no válido:", targetStatus);
        navigate(location.pathname, { replace: true });
        return null;
    }

    const config = STATUS_CONFIG[targetStatus as SaleStatus] || STATUS_CONFIG["En proceso"];
    const IconComponent = config.icon;

    const { data: sale, isLoading: isLoadingSale } = useQuery({
        queryKey: ["sale", saleId],
        queryFn: () => getSaleById({ saleId: saleId }),
        enabled: !!saleId && show,
        retry: false,
    });

    const updateStatusMutation = useMutation({
        mutationFn: updateSaleStatus,
        onSuccess: () => {
            toast.success(`Venta ${targetStatus.toLowerCase()} exitosamente`);
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["sale", saleId] });
            handleClose();
        },
        onError: (error: any) => {
            toast.error(error.message || "Error al actualizar el estado de la venta");
        },
    });

    const handleClose = () => {
        navigate(location.pathname, { replace: true });
    };

    const handleConfirm = () => {
        if (!sale) return;

        updateStatusMutation.mutate({
            saleId: sale._id,
            status: targetStatus,
        });
    };

    const getTotalItems = () => {
        if (!sale || !sale.items) return 0;
        return sale.items.reduce((total, item) => total + item.quantity, 0);
    };

    // Loading state
    if (isLoadingSale) return <Spinner />;

    if (sale)
        return (
            <Transition appear show={show && !!sale} as={Fragment}>
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
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all">
                                    {/* Header */}
                                    <div className={`relative bg-gradient-to-r ${config.color} px-6 py-4 text-white`}>
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={handleClose}
                                                className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-white/20 rounded-xl">
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <DialogTitle as="h3" className="text-xl font-bold">
                                                    {config.title}
                                                </DialogTitle>
                                                <p className="text-sm opacity-90">{config.message}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-6">
                                        {/* Información de la venta */}
                                        <div className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 mb-6`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <UserIcon className="h-5 w-5 text-gray-600" />
                                                    <span className="font-bold text-lg text-gray-900">{sale.customer}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-gray-900">{formatPrice(sale.total)}</div>
                                                    <div className="text-xs text-gray-500">Total</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                                                    <span className="text-gray-600">{formatDate(sale.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <ShoppingCartIcon className="h-4 w-4 text-gray-500" />
                                                    <span className="text-gray-600">
                                                        {sale.items?.length || 0} productos, {getTotalItems()} unidades
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vendedor</div>
                                                <div className="text-sm font-medium text-gray-700">{sale.seller?.username || "N/A"}</div>
                                            </div>
                                        </div>

                                        {/* Estado actual */}
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <div className="text-sm text-gray-600 mb-1">Estado actual:</div>
                                            <div className="font-bold text-gray-900">{sale.status}</div>
                                        </div>

                                        {/* Campo de razón para cancelación */}
                                        {targetStatus === "Cancelada" && (
                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Razón de la cancelación (opcional)
                                                </label>
                                                <textarea
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                                                    rows={3}
                                                    placeholder="Ej: Cliente canceló, producto agotado, error en la orden..."
                                                />
                                            </div>
                                        )}

                                        {/* Advertencia */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                                            <div className="flex items-start space-x-2">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                                                <div className="text-sm text-amber-800">
                                                    <strong>¿Estás seguro?</strong>
                                                    <br />
                                                    Esta acción cambiará el estado de la venta a "{targetStatus}"
                                                    {targetStatus === "Cancelada" && " y no se puede deshacer"}.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Botones */}
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleClose}
                                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleConfirm}
                                                disabled={updateStatusMutation.isPending}
                                                className={`flex-1 px-4 py-2 ${config.buttonColor} text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {updateStatusMutation.isPending ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <>
                                                        <span>{config.emoji}</span>
                                                        <span>{config.confirmText}</span>
                                                    </>
                                                )}
                                            </button>
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
