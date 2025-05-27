import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { XMarkIcon, TagIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../../utils";
import { getCategoryById } from "../../services/Category.Service";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

export default function CategoryDetailModal() {
    const categoryId = new URLSearchParams(useLocation().search).get("viewCategory") || "";
    const navigate = useNavigate();

    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => getCategoryById(categoryId),
        enabled: !!categoryId,
        retry: false,
    });

    if (isLoading) return <Spinner />;

    const handleClose = () => navigate(location.pathname, { replace: true });

    if (isError) {
        toast.error(error.message, { toastId: "error" });
        handleClose();
    }

    if (data)
        return (
            <Transition appear show={!!categoryId} as={Fragment}>
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
                                    {/* Header del Modal */}
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
                                                <TagIcon className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <DialogTitle as="h3" className="text-3xl font-bold">
                                                    Detalles de Categoría
                                                </DialogTitle>
                                                <p className="mt-1 text-blue-100">Información completa de la categoría</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenido del Modal */}
                                    <div className="px-8 py-8 space-y-6">
                                        {/* Información Principal */}
                                        <div className="bg-gray-50 rounded-2xl p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-xl font-bold text-gray-900">{data.name}</h4>
                                                <div className="flex items-center space-x-2">
                                                    {data.isActive ? (
                                                        <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            <span className="text-sm font-medium">Activa</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                                                            <XCircleIcon className="h-4 w-4" />
                                                            <span className="text-sm font-medium">Inactiva</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Descripción</label>
                                                    <p className="mt-1 text-gray-900 leading-relaxed">{data.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subcategorías */}
                                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
                                            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                                <TagIcon className="h-5 w-5 mr-2 text-purple-600" />
                                                Subcategorías ({data.subCategories.length})
                                            </h4>

                                            {data.subCategories.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {data.subCategories.map((subCategory, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-white px-4 py-3 rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow duration-200"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                                <span className="text-gray-900 font-medium">{subCategory}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 text-gray-500">
                                                    <TagIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                                    <p>No hay subcategorías registradas</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Información de Fechas */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <CalendarIcon className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-green-900">Fecha de Creación</h5>
                                                        <p className="text-sm text-green-700">{formatDate(data.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <ClockIcon className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-blue-900">Última Actualización</h5>
                                                        <p className="text-sm text-blue-700">{formatDate(data.updatedAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        {/* <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                            <button
                                                onClick={handleClose}
                                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                                            >
                                                Cerrar
                                            </button>
                                        </div> */}
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        );
}
