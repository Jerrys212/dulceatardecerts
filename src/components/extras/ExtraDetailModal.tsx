import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon, CubeIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import { getExtraById } from "../../services/Extras.Service";
import { formatDate, formatPrice } from "../../utils";

export default function ExtraDetailModal() {
    const extraId = new URLSearchParams(useLocation().search).get("viewExtra") || "";
    const navigate = useNavigate();

    const {
        data: extra,
        isError,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["extra", extraId],
        queryFn: () => getExtraById({ extraId }),
        enabled: !!extraId,
        retry: false,
    });

    if (isLoading) return <Spinner />;

    const handleClose = () => navigate(location.pathname, { replace: true });

    if (isError) {
        toast.error(error.message, { toastId: "error" });
        handleClose();
    }

    if (extra)
        return (
            <Transition appear show={!!extraId} as={Fragment}>
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
                                <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all">
                                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-white">
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={handleClose}
                                                className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-white/20 rounded-2xl">
                                                <CubeIcon className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <DialogTitle as="h3" className="text-3xl font-bold">
                                                    Detalles del Extra
                                                </DialogTitle>
                                                <p className="mt-1 text-green-100">Información completa del extra</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-8 py-8 space-y-6">
                                        <div className="bg-gray-50 rounded-2xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-2xl font-bold text-gray-900">{extra.name}</h4>
                                                <div className="flex items-center space-x-3">
                                                    <div className="text-right">
                                                        <div className="text-3xl font-bold text-green-600">{formatPrice(extra.price)}</div>
                                                        <div className="text-sm text-gray-500">Precio adicional</div>
                                                    </div>
                                                    {extra.isActive ? (
                                                        <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            <span className="text-sm font-medium">Activo</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                                                            <XCircleIcon className="h-4 w-4" />
                                                            <span className="text-sm font-medium">Inactivo</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Información del Extra */}
                                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                                <TagIcon className="h-5 w-5 mr-2 text-blue-600" />
                                                Información del Extra
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-white px-4 py-4 rounded-lg shadow-sm border border-blue-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <div className="text-lg">💰</div>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium text-blue-900">Tipo</h5>
                                                            <p className="text-blue-700 font-semibold">Extra Adicional</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white px-4 py-4 rounded-lg shadow-sm border border-purple-100">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-purple-100 rounded-lg">
                                                            <div className="text-lg">📊</div>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium text-purple-900">Estado</h5>
                                                            <p className="text-purple-700 font-semibold">
                                                                {extra.isActive ? "Disponible" : "No disponible"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Información adicional sobre el costo */}
                                            <div className="mt-4 bg-white rounded-lg p-4 border border-green-100">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <div className="text-lg">🧮</div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-green-900">Información de precio</h5>
                                                        <p className="text-sm text-green-700">
                                                            Este costo se agrega al precio base del producto cuando es seleccionado
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <CalendarIcon className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-blue-900">Fecha de Creación</h5>
                                                        <p className="text-sm text-blue-700">{formatDate(extra.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-amber-100 rounded-lg">
                                                        <ClockIcon className="h-5 w-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-amber-900">Última Actualización</h5>
                                                        <p className="text-sm text-amber-700">{formatDate(extra.updatedAt)}</p>
                                                    </div>
                                                </div>
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
