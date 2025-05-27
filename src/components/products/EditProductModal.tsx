import { useState, useEffect } from "react";
import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { XMarkIcon, PencilIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateProduct, getProductById } from "../../services/Products.Service";
import { toast } from "react-toastify";
import { Category, ProductFormData } from "../../types";
import Spinner from "../Spinner";

type EditProductModalProps = {
    categories: Category[] | undefined;
};

export default function EditProductModal({ categories }: EditProductModalProps) {
    const productId = new URLSearchParams(useLocation().search).get("editProduct") || "";
    const show = new URLSearchParams(useLocation().search).has("editProduct");
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ProductFormData>({
        defaultValues: {
            name: "",
            description: "",
            category: "",
            subCategory: "",
            price: 0,
        },
    });

    // Query para obtener los datos del producto
    const { data: productData, isLoading: isLoadingProduct } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => getProductById({ productId: productId }!),
        enabled: !!productId && show,
    });

    // Watch para detectar cambios en la categoría seleccionada
    const watchedCategory = watch("category");

    // Llenar el formulario cuando se cargan los datos del producto
    useEffect(() => {
        // ESPERAR A QUE AMBOS ESTÉN DISPONIBLES
        if (productData && categories && categories.length > 0) {
            const product = productData;

            // PRIMERO: Encontrar y establecer las subcategorías
            const productCategory = categories.find((cat) => cat._id === product.category._id);
            if (productCategory) {
                setAvailableSubCategories(productCategory.subCategories || []);
            }

            // Llenar campos básicos (sin subcategoría aún)
            setValue("name", product.name);
            setValue("description", product.description);
            setValue("category", product.category._id);
            setValue("price", product.price);
        }
    }, [productData, categories, setValue]);

    // Establecer subcategoría DESPUÉS de que availableSubCategories se haya actualizado
    useEffect(() => {
        if (productData && availableSubCategories.length > 0) {
            // Verificar que la subcategoría del producto está en las subcategorías disponibles
            if (availableSubCategories.includes(productData.subCategory)) {
                setValue("subCategory", productData.subCategory);
            }
        }
    }, [productData, availableSubCategories, setValue]);

    // Actualizar subcategorías cuando cambia la categoría
    useEffect(() => {
        if (watchedCategory && categories && categories.length > 0 && productData) {
            const selectedCategory = categories.find((cat) => cat._id === watchedCategory);
            if (selectedCategory) {
                setAvailableSubCategories(selectedCategory.subCategories || []);
                // Solo limpiar subcategoría si cambió de la original
                if (watchedCategory !== productData.category._id) {
                    setValue("subCategory", "");
                }
            }
        }
    }, [watchedCategory, categories, setValue, productData]); // Dependencias correctas

    // Mutación para actualizar producto
    const { mutate, isPending } = useMutation({
        mutationFn: updateProduct,
        onSuccess: (data) => {
            // Invalidar queries relevantes
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", productId] });

            // Mostrar toast de éxito
            toast.success(data.message || "Producto actualizado exitosamente");

            // Cerrar modal
            handleClose();
        },
        onError: (error: any) => {
            // Mostrar toast de error
            toast.error(error.message || "Error al actualizar el producto");
        },
    });

    const handleFormSubmit = (data: ProductFormData) => {
        if (!productId) return;

        const formDataWithParsedPrice = {
            ...data,
            price: Number(data.price),
        };

        mutate({ productId, formData: formDataWithParsedPrice });
    };

    const handleClose = () => {
        reset();
        setAvailableSubCategories([]);
        navigate(location.pathname, { replace: true });
    };

    // Mostrar loading si está cargando los datos
    if (isLoadingProduct) return <Spinner />;

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
                                <div className="relative bg-gradient-to-r from-orange-600 to-red-600 px-8 py-8 text-white">
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
                                                Editar Producto
                                            </DialogTitle>
                                            <p className="mt-1 text-orange-100">Modifica la información de "{productData?.name}"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Formulario */}
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="px-8 py-8 space-y-6">
                                    {/* Campo Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto *</label>
                                        <input
                                            {...register("name", {
                                                required: "El nombre es obligatorio",
                                                minLength: {
                                                    value: 2,
                                                    message: "El nombre debe tener al menos 2 caracteres",
                                                },
                                            })}
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                            placeholder="Ej: Crepa de Plátano"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                                            placeholder="Describe el producto..."
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                                    </div>

                                    {/* Grid para Categoría, Subcategoría y Precio */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Campo Categoría */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                                            <select
                                                {...register("category", {
                                                    required: "La categoría es obligatoria",
                                                })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                                disabled={!categories}
                                            >
                                                <option value="">{!categories ? "Cargando..." : "Selecciona una categoría"}</option>
                                                {categories?.map((category) => (
                                                    <option key={category._id} value={category._id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                                        </div>

                                        {/* Campo Subcategoría */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Subcategoría *</label>
                                            <select
                                                {...register("subCategory", {
                                                    required: "La subcategoría es obligatoria",
                                                })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                                disabled={availableSubCategories.length === 0}
                                            >
                                                <option value="">
                                                    {availableSubCategories.length === 0
                                                        ? "Selecciona primero una categoría"
                                                        : "Selecciona una subcategoría"}
                                                </option>
                                                {availableSubCategories.map((subCategory) => (
                                                    <option key={subCategory} value={subCategory}>
                                                        {subCategory}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.subCategory && <p className="mt-1 text-sm text-red-600">{errors.subCategory.message}</p>}
                                        </div>
                                    </div>

                                    {/* Campo Precio */}
                                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <CurrencyDollarIcon className="h-5 w-5 text-orange-600" />
                                            <label className="text-lg font-medium text-gray-900">Precio del Producto</label>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-lg font-medium">$</span>
                                            </div>
                                            <input
                                                {...register("price", {
                                                    required: "El precio es obligatorio",
                                                    min: {
                                                        value: 0.01,
                                                        message: "El precio debe ser mayor a 0",
                                                    },
                                                    valueAsNumber: true,
                                                })}
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="w-full pl-8 pr-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 text-lg font-medium"
                                                placeholder="0.00"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-400 text-sm">MXN</span>
                                            </div>
                                        </div>
                                        {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
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
                                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                                                "Actualizar Producto"
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
