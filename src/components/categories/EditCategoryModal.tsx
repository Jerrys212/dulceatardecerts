import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { XMarkIcon, PencilIcon, TagIcon, XCircleIcon, CheckIcon } from "@heroicons/react/24/outline";
import { CategoryFormData } from "../../types";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateCategory, getCategoryById } from "../../services/Category.Service";
import { toast } from "react-toastify";

export default function EditCategoryModal() {
    const categoryId = new URLSearchParams(useLocation().search).get("editCategory") || "";
    const show = new URLSearchParams(useLocation().search).has("editCategory");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [currentSubCategory, setCurrentSubCategory] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<CategoryFormData>({
        defaultValues: {
            name: "",
            description: "",
            subCategories: [],
        },
    });

    const { data: categoryData } = useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => getCategoryById(categoryId!),
        enabled: !!categoryId && show,
    });

    useEffect(() => {
        if (categoryData) {
            const category = categoryData;
            setValue("name", category.name);
            setValue("description", category.description);
            setSubCategories(category.subCategories || []);
            setValue("subCategories", category.subCategories || []);
        }
    }, [categoryData, setValue]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateCategory,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["category", categoryId] });

            toast.success(data);

            handleClose();
        },
        onError: (error: any) => {
            toast.error(error.message || "Error al actualizar la categoría");
        },
    });

    const handleAddSubCategory = () => {
        if (currentSubCategory.trim() && !subCategories.includes(currentSubCategory.trim())) {
            const newSubCategories = [...subCategories, currentSubCategory.trim()];
            setSubCategories(newSubCategories);
            setValue("subCategories", newSubCategories);
            setCurrentSubCategory("");
        }
    };

    const handleRemoveSubCategory = (index: number) => {
        const newSubCategories = subCategories.filter((_, i) => i !== index);
        setSubCategories(newSubCategories);
        setValue("subCategories", newSubCategories);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSubCategory();
        }
    };

    const handleFormSubmit = (data: CategoryFormData) => {
        if (!categoryId) return;

        const formDataWithSubCategories = {
            ...data,
            subCategories: subCategories,
        };

        mutate({ categoryId, formData: formDataWithSubCategories });
    };

    const handleClose = () => {
        reset();
        setSubCategories([]);
        setCurrentSubCategory("");
        navigate(location.pathname, { replace: true });
    };

    return (
        <Transition appear show={show} as={Fragment}>
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
                                <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-8 text-white">
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
                                            <PencilIcon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <DialogTitle as="h3" className="text-3xl font-bold">
                                                Editar Categoría
                                            </DialogTitle>
                                            <p className="mt-1 text-amber-100">Modifica la información de "{categoryData?.name}"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario */}
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-8 py-8 space-y-6">
                                    {/* Campo Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Categoría *</label>
                                        <input
                                            {...register("name", {
                                                required: "El nombre es obligatorio",
                                                minLength: {
                                                    value: 2,
                                                    message: "El nombre debe tener al menos 2 caracteres",
                                                },
                                            })}
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                                            placeholder="Ej: Waffles"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                                    </div>

                                    {/* Campo Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
                                        <textarea
                                            {...register("description", {
                                                required: "La descripción es obligatoria",
                                                minLength: {
                                                    value: 10,
                                                    message: "La descripción debe tener al menos 10 caracteres",
                                                },
                                            })}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200 resize-none"
                                            placeholder="Describe brevemente esta categoría..."
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                                    </div>

                                    {/* Subcategorías */}
                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <TagIcon className="h-5 w-5 text-orange-600" />
                                            <label className="text-lg font-medium text-gray-900">Subcategorías ({subCategories.length})</label>
                                        </div>

                                        {/* Input para agregar subcategorías */}
                                        <div className="flex space-x-3 mb-4">
                                            <input
                                                type="text"
                                                value={currentSubCategory}
                                                onChange={(e) => setCurrentSubCategory(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                                placeholder="Nombre de la subcategoría"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddSubCategory}
                                                disabled={!currentSubCategory.trim()}
                                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                                <span>Agregar</span>
                                            </button>
                                        </div>

                                        {/* Lista de subcategorías agregadas */}
                                        {subCategories.length > 0 ? (
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 mb-3">Subcategorías actuales:</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {subCategories.map((subCategory, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-white px-3 py-2 rounded-lg shadow-sm border border-orange-100 flex items-center justify-between group hover:shadow-md transition-shadow duration-200"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <CheckIcon className="h-4 w-4 text-green-500" />
                                                                <span className="text-gray-900 font-medium text-sm">{subCategory}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSubCategory(index)}
                                                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                            >
                                                                <XCircleIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                <TagIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                                <p className="text-sm">No hay subcategorías</p>
                                                <p className="text-xs">Escribe una subcategoría y presiona "Agregar" o Enter</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            style={{ pointerEvents: isPending ? "none" : "auto" }}
                                        >
                                            {isPending ? (
                                                <span className="flex items-center">
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Actualizando...
                                                </span>
                                            ) : (
                                                "Actualizar Categoría"
                                            )}
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
