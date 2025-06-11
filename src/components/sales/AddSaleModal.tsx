import { useState } from "react";
import { Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { XMarkIcon, ShoppingCartIcon, TrashIcon, TagIcon, ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartItem, Category, Product, SaleFormData, Extra } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../../services/Products.Service";
import { getExtras } from "../../services/Extras.Service";
import { createSale } from "../../services/Sale.Service";
import { formatPrice } from "../../utils";

interface AddSaleModalProps {
    categories: Category[] | undefined;
}

export default function AddSaleModal({ categories }: AddSaleModalProps) {
    const show = new URLSearchParams(useLocation().search).has("addSale");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Estados para el flujo paso a paso
    const [currentStep, setCurrentStep] = useState<"category" | "subcategory" | "product">("category");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

    // Estados para el carrito de compras
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [showProductForm, setShowProductForm] = useState(false);

    // Estados para el formulario de producto actual
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]); // IDs de extras seleccionados

    // Estados para mostrar/ocultar extras
    const [showExtras, setShowExtras] = useState(false);

    const { data: mockProducts } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
        retry: false,
    });

    // Query para obtener extras activos
    const { data: extrasData } = useQuery({
        queryKey: ["extras"],
        queryFn: () => getExtras(),
        retry: false,
    });

    // Filtrar solo extras activos
    const activeExtras = extrasData?.filter((extra: Extra) => extra.isActive) || [];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SaleFormData>({
        defaultValues: {
            customer: "",
            items: [],
        },
    });

    // Manejar selección de categoría
    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setSelectedSubCategory("");
        setCurrentStep("subcategory");
    };

    // Manejar selección de subcategoría
    const handleSubCategorySelect = (subCategory: string) => {
        setSelectedSubCategory(subCategory);

        // Filtrar productos por categoría y subcategoría
        const filteredProducts = mockProducts?.filter(
            (product) => product.category._id === selectedCategory?._id && product.subCategory === subCategory
        );

        setAvailableProducts(filteredProducts || []);
        setCurrentStep("product");
        setShowProductForm(true);
    };

    // Manejar selección de producto
    const handleProductSelect = (productId: string) => {
        const product = availableProducts.find((p) => p._id === productId);
        if (product) {
            setCurrentProduct(product);
            setQuantity(1);
            setSelectedExtras([]);
            setShowExtras(false); // Reset estado del accordion
        }
    };

    // Manejar selección de extras
    const handleExtraSelect = (extraId: string) => {
        setSelectedExtras((prev) => {
            if (prev.includes(extraId)) {
                return prev.filter((id) => id !== extraId);
            } else {
                return [...prev, extraId];
            }
        });
    };

    // Calcular precio de extras seleccionados
    const getExtrasPrice = () => {
        return selectedExtras.reduce((total, extraId) => {
            const extra = activeExtras.find((e: Extra) => e._id === extraId);
            return total + (extra?.price || 0);
        }, 0);
    };

    // Calcular subtotal del producto actual (incluyendo extras)
    const getCurrentSubtotal = () => {
        if (!currentProduct) return 0;
        const basePrice = currentProduct.price * quantity;
        const extrasPrice = getExtrasPrice() * quantity; // Multiplicar extras por cantidad
        return basePrice + extrasPrice;
    };

    // Agregar producto al carrito
    const addToCart = () => {
        if (!currentProduct) return;

        const subtotal = getCurrentSubtotal();
        const newItem: CartItem = {
            product: currentProduct._id,
            name: currentProduct.name,
            price: currentProduct.price,
            quantity,
            extras: selectedExtras, // Array de IDs de extras
            subtotal,
        };

        setCartItems((prev) => [...prev, newItem]);

        // Resetear formulario de producto
        setCurrentProduct(null);
        setQuantity(1);
        setSelectedExtras([]);
        setShowExtras(false); // Reset accordion
        setShowProductForm(false);

        toast.success("Producto agregado al carrito");
    };

    // Remover producto del carrito
    const removeFromCart = (index: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
        toast.info("Producto removido del carrito");
    };

    // Agregar otro producto (reiniciar flujo)
    const addAnotherProduct = () => {
        setCurrentStep("category");
        setSelectedCategory(null);
        setSelectedSubCategory("");
        setAvailableProducts([]);
        setShowProductForm(false);
    };

    // Volver al paso anterior
    const goBack = () => {
        if (currentStep === "subcategory") {
            setCurrentStep("category");
            setSelectedCategory(null);
        } else if (currentStep === "product") {
            setCurrentStep("subcategory");
            setSelectedSubCategory("");
            setAvailableProducts([]);
            setShowProductForm(false);
        }
    };

    // Calcular total del carrito
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.subtotal, 0);
    };

    // Obtener extras de un item del carrito para mostrar
    const getItemExtrasDisplay = (extraIds: string[]) => {
        return extraIds
            .map((id) => {
                const extra = activeExtras.find((e: Extra) => e._id === id);
                return extra ? `${extra.name} (+${formatPrice(extra.price)})` : "";
            })
            .filter(Boolean);
    };

    const { mutate } = useMutation({
        mutationFn: createSale,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            toast.success(data.message);
            handleClose();
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    // Enviar venta
    const handleFormSubmit = (formData: SaleFormData) => {
        if (cartItems.length === 0) {
            toast.error("Agrega al menos un producto al carrito");
            return;
        }

        const saleData = {
            customer: formData.customer,
            items: cartItems,
            total: getCartTotal(),
        };

        mutate({ formData: saleData });
    };

    // Cerrar modal
    const handleClose = () => {
        reset();
        setCartItems([]);
        setCurrentStep("category");
        setSelectedCategory(null);
        setSelectedSubCategory("");
        setAvailableProducts([]);
        setShowProductForm(false);
        setSelectedExtras([]);
        setShowExtras(false);
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
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all">
                                {/* Header del Modal */}
                                <div className="relative bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6 text-white">
                                    <div className="absolute top-4 right-4">
                                        <button
                                            onClick={handleClose}
                                            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-white/20 rounded-2xl">
                                                <ShoppingCartIcon className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <DialogTitle as="h3" className="text-2xl font-bold">
                                                    Nueva Venta
                                                </DialogTitle>
                                                <p className="mt-1 text-green-100">
                                                    {currentStep === "category" && "Selecciona una categoría"}
                                                    {currentStep === "subcategory" && "Elige una subcategoría"}
                                                    {currentStep === "product" && "Configura tu producto"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Botón volver */}
                                        {currentStep !== "category" && (
                                            <button
                                                onClick={goBack}
                                                className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                                            >
                                                <ArrowLeftIcon className="w-4 h-4" />
                                                <span className="text-sm">Volver</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
                                    {/* Panel izquierdo - Selección de productos */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Paso 1: Seleccionar Categoría */}
                                        {currentStep === "category" && (
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Selecciona una Categoría</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {categories?.map((category) => (
                                                        <button
                                                            key={category._id}
                                                            onClick={() => handleCategorySelect(category)}
                                                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <TagIcon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900">{category.name}</h5>
                                                                    <p className="text-sm text-gray-500">
                                                                        {category.subCategories.length} subcategorías
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Paso 2: Seleccionar Subcategoría */}
                                        {currentStep === "subcategory" && selectedCategory && (
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Subcategorías de {selectedCategory.name}</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {selectedCategory.subCategories.map((subCategory) => (
                                                        <button
                                                            key={subCategory}
                                                            onClick={() => handleSubCategorySelect(subCategory)}
                                                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-3 h-3 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                                                                <span className="font-medium text-gray-900">{subCategory}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Paso 3: Configurar Producto */}
                                        {currentStep === "product" && showProductForm && (
                                            <div className="space-y-6">
                                                <h4 className="text-lg font-semibold text-gray-900">
                                                    Productos en {selectedCategory?.name} - {selectedSubCategory}
                                                </h4>

                                                {/* Selector de producto */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Producto *</label>
                                                    <select
                                                        onChange={(e) => handleProductSelect(e.target.value)}
                                                        value={currentProduct?._id || ""}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">Selecciona un producto</option>
                                                        {availableProducts.map((product) => (
                                                            <option key={product._id} value={product._id}>
                                                                {product.name} - {formatPrice(product.price)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Configuración del producto seleccionado */}
                                                {currentProduct && (
                                                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-medium text-gray-900">{currentProduct.name}</h5>
                                                            <span className="text-lg font-bold text-green-600">
                                                                {formatPrice(currentProduct.price)}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad *</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={quantity}
                                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Accordion de Extras */}
                                                        <div className="space-y-4">
                                                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowExtras(!showExtras)}
                                                                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <PlusIcon
                                                                            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                                                                                showExtras ? "rotate-45" : ""
                                                                            }`}
                                                                        />
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            Agregar extras
                                                                            {selectedExtras.length > 0 && (
                                                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                                                    {selectedExtras.length} seleccionado
                                                                                    {selectedExtras.length > 1 ? "s" : ""}
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    {getExtrasPrice() > 0 && (
                                                                        <span className="text-sm font-semibold text-green-600">
                                                                            +{formatPrice(getExtrasPrice() * quantity)}
                                                                        </span>
                                                                    )}
                                                                </button>

                                                                {showExtras && (
                                                                    <div className="p-4 bg-white border-t border-gray-200">
                                                                        {activeExtras.length > 0 ? (
                                                                            <div className="space-y-4">
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                    {activeExtras.map((extra: Extra) => (
                                                                                        <label
                                                                                            key={extra._id}
                                                                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                                                                                                selectedExtras.includes(extra._id)
                                                                                                    ? "border-blue-500 bg-blue-50"
                                                                                                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                                                                                            }`}
                                                                                        >
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={selectedExtras.includes(extra._id)}
                                                                                                onChange={() => handleExtraSelect(extra._id)}
                                                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                                                            />
                                                                                            <div className="ml-3 flex-1">
                                                                                                <div className="flex items-center justify-between">
                                                                                                    <span className="text-sm font-medium text-gray-900">
                                                                                                        {extra.name}
                                                                                                    </span>
                                                                                                    <span className="text-sm font-semibold text-green-600">
                                                                                                        +{formatPrice(extra.price)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </label>
                                                                                    ))}
                                                                                </div>

                                                                                {/* Resumen de extras seleccionados */}
                                                                                {selectedExtras.length > 0 && (
                                                                                    <div className="bg-blue-50 rounded-lg p-3 mt-4">
                                                                                        <p className="text-sm font-medium text-blue-900 mb-2">
                                                                                            Resumen de extras:
                                                                                        </p>
                                                                                        <div className="space-y-1">
                                                                                            {selectedExtras.map((extraId) => {
                                                                                                const extra = activeExtras.find(
                                                                                                    (e: Extra) => e._id === extraId
                                                                                                );
                                                                                                return extra ? (
                                                                                                    <div
                                                                                                        key={extraId}
                                                                                                        className="flex justify-between text-sm"
                                                                                                    >
                                                                                                        <span className="text-blue-800">
                                                                                                            {extra.name}
                                                                                                        </span>
                                                                                                        <span className="text-blue-900 font-medium">
                                                                                                            +{formatPrice(extra.price)} × {quantity} ={" "}
                                                                                                            {formatPrice(extra.price * quantity)}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                ) : null;
                                                                                            })}
                                                                                            <div className="border-t border-blue-200 pt-2 mt-2">
                                                                                                <div className="flex justify-between text-sm font-semibold">
                                                                                                    <span className="text-blue-900">
                                                                                                        Total extras:
                                                                                                    </span>
                                                                                                    <span className="text-blue-900">
                                                                                                        {formatPrice(getExtrasPrice() * quantity)}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-gray-500 text-sm italic text-center py-4">
                                                                                No hay extras disponibles
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Subtotal más visible */}
                                                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
                                                            <div className="space-y-3">
                                                                {/* Desglose de precios */}
                                                                <div className="flex justify-between items-center text-lg">
                                                                    <span className="font-medium text-gray-700">Producto base:</span>
                                                                    <span className="font-semibold text-gray-900">
                                                                        {formatPrice(currentProduct.price)} × {quantity} ={" "}
                                                                        {formatPrice(currentProduct.price * quantity)}
                                                                    </span>
                                                                </div>

                                                                {getExtrasPrice() > 0 && (
                                                                    <div className="flex justify-between items-center text-lg">
                                                                        <span className="font-medium text-blue-700">Extras:</span>
                                                                        <span className="font-semibold text-blue-900">
                                                                            +{formatPrice(getExtrasPrice() * quantity)}
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                <div className="border-t-2 border-green-300 pt-3">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-2xl font-bold text-gray-900">SUBTOTAL:</span>
                                                                        <span className="text-3xl font-bold text-green-600">
                                                                            {formatPrice(getCurrentSubtotal())}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <button
                                                                onClick={addToCart}
                                                                className="w-full mt-4 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                                                            >
                                                                🛒 Agregar al Carrito
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Botón para agregar otro producto */}
                                        {cartItems.length > 0 && !showProductForm && (
                                            <button
                                                onClick={addAnotherProduct}
                                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors duration-200"
                                            >
                                                + Agregar otro producto
                                            </button>
                                        )}
                                    </div>

                                    {/* Panel derecho - Carrito y formulario */}
                                    <div className="lg:col-span-1 space-y-6">
                                        {/* Carrito */}
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                                                Carrito ({cartItems.length})
                                            </h4>

                                            {cartItems.length === 0 ? (
                                                <p className="text-gray-500 text-center py-4">El carrito está vacío</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {cartItems.map((item, index) => (
                                                        <div key={index} className="bg-white rounded-lg p-3 border">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <h6 className="font-medium text-sm">{item.name}</h6>
                                                                    <p className="text-xs text-gray-500">
                                                                        {item.quantity}x {formatPrice(item.price)}
                                                                    </p>
                                                                    {item.extras && item.extras.length > 0 && (
                                                                        <div className="text-xs text-blue-600 mt-1">
                                                                            <p className="font-medium">Extras:</p>
                                                                            {getItemExtrasDisplay(item.extras).map((extraDisplay, idx) => (
                                                                                <p key={idx} className="ml-2">
                                                                                    • {extraDisplay}
                                                                                </p>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    <p className="text-sm font-semibold text-green-600 mt-1">
                                                                        {formatPrice(item.subtotal)}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => removeFromCart(index)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="border-t pt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 -mx-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xl font-bold text-gray-900">TOTAL:</span>
                                                            <span className="text-3xl font-bold text-green-600 bg-white px-4 py-2 rounded-lg shadow-lg">
                                                                {formatPrice(getCartTotal())}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Formulario de cliente */}
                                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
                                                <input
                                                    {...register("customer", {
                                                        required: "El nombre del cliente es obligatorio",
                                                    })}
                                                    type="text"
                                                    placeholder="Nombre del cliente"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                                {errors.customer && <p className="mt-1 text-sm text-red-600">{errors.customer.message}</p>}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={cartItems.length === 0}
                                                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200"
                                            >
                                                Completar Venta
                                            </button>
                                        </form>
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
