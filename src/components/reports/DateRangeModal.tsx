import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { XMarkIcon, CalendarDaysIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

type DateRange = {
    startDate: string;
    endDate: string;
};

type DateRangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (dateRange: DateRange) => Promise<void>;
    title: string;
};

export default function DateRangeModal({ isOpen, onClose, onGenerate, title }: DateRangeModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<DateRange>({
        defaultValues: {
            startDate: "",
            endDate: "",
        },
    });

    const startDate = watch("startDate");
    const endDate = watch("endDate");

    const handleFormSubmit = async (data: DateRange) => {
        try {
            await onGenerate(data);
            handleClose();
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    const handleClose = () => {
        reset();

        onClose();
    };

    // Función para obtener la fecha de hoy en formato YYYY-MM-DD
    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    // Función para obtener la fecha de hace 30 días
    const getThirtyDaysAgoDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split("T")[0];
    };

    // Función para obtener el primer día del mes actual
    const getFirstDayOfMonth = () => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
    };

    // Función para establecer rangos predefinidos
    const setQuickRange = (days: number) => {
        const endDate = getTodayDate();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        reset({
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate,
        });
    };

    const setCurrentMonth = () => {
        reset({
            startDate: getFirstDayOfMonth(),
            endDate: getTodayDate(),
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
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
                                <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-8 text-white">
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
                                            <CalendarDaysIcon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <DialogTitle as="h3" className="text-3xl font-bold">
                                                Seleccionar Período
                                            </DialogTitle>
                                            <p className="mt-1 text-green-100">Define el rango de fechas para: {title}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario */}
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-8 py-8 space-y-6">
                                    {/* Rangos Rápidos */}
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                                        <h4 className="text-lg font-medium text-gray-900 mb-4">Rangos Rápidos</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setQuickRange(7)}
                                                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Últimos 7 días
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setQuickRange(15)}
                                                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Últimos 15 días
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setQuickRange(30)}
                                                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Últimos 30 días
                                            </button>
                                            <button
                                                type="button"
                                                onClick={setCurrentMonth}
                                                className="px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-sm font-medium"
                                            >
                                                Mes actual
                                            </button>
                                        </div>
                                    </div>

                                    {/* Campos de Fecha Personalizados */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Fecha de Inicio */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
                                            <input
                                                {...register("startDate", {
                                                    required: "La fecha de inicio es obligatoria",
                                                    validate: (value) => {
                                                        if (!value) return "La fecha de inicio es obligatoria";
                                                        if (endDate && new Date(value) > new Date(endDate)) {
                                                            return "La fecha de inicio debe ser anterior a la fecha de fin";
                                                        }
                                                        return true;
                                                    },
                                                })}
                                                type="date"
                                                max={getTodayDate()}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            />
                                            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
                                        </div>

                                        {/* Fecha de Fin */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin *</label>
                                            <input
                                                {...register("endDate", {
                                                    required: "La fecha de fin es obligatoria",
                                                    validate: (value) => {
                                                        if (!value) return "La fecha de fin es obligatoria";
                                                        if (startDate && new Date(value) < new Date(startDate)) {
                                                            return "La fecha de fin debe ser posterior a la fecha de inicio";
                                                        }
                                                        return true;
                                                    },
                                                })}
                                                type="date"
                                                min={startDate || undefined}
                                                max={getTodayDate()}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                                            />
                                            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
                                        </div>
                                    </div>

                                    {/* Información del Rango Seleccionado */}
                                    {startDate && endDate && (
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                                            <div className="flex items-center space-x-2">
                                                <CalendarDaysIcon className="h-5 w-5 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">
                                                    Período seleccionado:{" "}
                                                    {Math.ceil(
                                                        (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1
                                                    )}{" "}
                                                    días
                                                </span>
                                            </div>
                                            <p className="text-sm text-green-700 mt-1">
                                                Desde{" "}
                                                {new Date(startDate).toLocaleDateString("es-ES", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}{" "}
                                                hasta{" "}
                                                {new Date(endDate).toLocaleDateString("es-ES", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {/* Botones de acción */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                                        >
                                            <>
                                                <DocumentArrowDownIcon className="h-5 w-5" />
                                                <span>Generar Reporte</span>
                                            </>
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
