import { PlusIcon, ShoppingBagIcon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ProductCard from "../../components/products/ProductsCard";
import Spinner from "../../components/Spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/Products.Service";
import ProductDetailModal from "../../components/products/ProductDetailModal";
import AddProductModal from "../../components/products/AddProductModal";
import EditProductModal from "../../components/products/EditProductModal";
import { getCategories } from "../../services/Category.Service";
import { useSocket } from "../../context/useSocket";
import { useEffect, useState, useMemo } from "react";
import { Product, Category } from "../../types"; // Asegúrate de importar los tipos

const Products = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isConnected, on, off } = useSocket();

    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
        retry: false,
    });

    // Query para obtener categorías
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const showEditModal = new URLSearchParams(location.search).has("editProduct");

    // Filtrar productos basado en búsqueda y categoría
    const filteredProducts = useMemo(() => {
        if (!data) return [];

        return data.filter((product: Product) => {
            // Filtro por término de búsqueda
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro por categoría
            const matchesCategory = selectedCategory === "all" || product.category._id === selectedCategory;

            // Filtro por subcategoría
            const matchesSubCategory = selectedSubCategory === "all" || product.subCategory === selectedSubCategory;

            return matchesSearch && matchesCategory && matchesSubCategory;
        });
    }, [data, searchTerm, selectedCategory, selectedSubCategory]);

    // Obtener subcategorías de la categoría seleccionada
    const availableSubCategories = useMemo(() => {
        if (!categories || selectedCategory === "all") return [];

        const category = categories.find((cat: Category) => cat._id === selectedCategory);
        return category?.subCategories || [];
    }, [categories, selectedCategory]);

    // Limpiar filtros
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSelectedSubCategory("all");
    };

    // Contar filtros activos
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedCategory !== "all") count++;
        if (selectedSubCategory !== "all") count++;
        return count;
    }, [searchTerm, selectedCategory, selectedSubCategory]);

    useEffect(() => {
        if (!isConnected) return;

        const refreshAllData = () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        };

        const eventsToListen = ["newCategory", "deletedCategory", "updatedCategory", "newProduct", "updateProduct", "deletedProduct"];

        eventsToListen.forEach((event) => {
            on(event, refreshAllData);
        });

        return () => {
            eventsToListen.forEach((event) => {
                off(event);
            });
        };
    }, [on, off, isConnected, queryClient]);

    // Resetear subcategoría cuando cambia la categoría
    useEffect(() => {
        setSelectedSubCategory("all");
    }, [selectedCategory]);

    if (isLoading) return <Spinner />;

    if (data)
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                            <p className="mt-2 text-gray-600">
                                Gestiona tu catálogo completo de productos y servicios
                                {activeFiltersCount > 0 && (
                                    <span className="ml-2 text-sm text-blue-600">
                                        ({filteredProducts.length} de {data.length} productos)
                                    </span>
                                )}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(location.pathname + `?addProduct`)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105 transition-all duration-200"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Agregar Producto
                        </button>
                    </div>

                    {/* Barra de búsqueda y filtros */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Buscador */}
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Buscar productos por nombre o descripción..."
                                    />
                                </div>
                            </div>

                            {/* Botón mostrar/ocultar filtros */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`inline-flex items-center px-4 py-3 border rounded-lg font-medium transition-colors duration-200 ${
                                        showFilters || activeFiltersCount > 0
                                            ? "border-blue-500 text-blue-700 bg-blue-50"
                                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    <FunnelIcon className="w-5 h-5 mr-2" />
                                    Filtros
                                    {activeFiltersCount > 0 && (
                                        <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-1">{activeFiltersCount}</span>
                                    )}
                                </button>

                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                    >
                                        <XMarkIcon className="w-4 h-4 mr-1" />
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Panel de filtros expandible */}
                        {showFilters && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Filtro por categoría */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">Todas las categorías</option>
                                            {categories?.map((category: Category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Filtro por subcategoría */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subcategoría</label>
                                        <select
                                            value={selectedSubCategory}
                                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                                            disabled={selectedCategory === "all" || availableSubCategories.length === 0}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            <option value="all">Todas las subcategorías</option>
                                            {availableSubCategories.map((subCategory: string) => (
                                                <option key={subCategory} value={subCategory}>
                                                    {subCategory}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumen de filtros activos */}
                    {activeFiltersCount > 0 && (
                        <div className="mb-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-600">Filtros activos:</span>

                                {searchTerm && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Búsqueda: "{searchTerm}"
                                        <button onClick={() => setSearchTerm("")} className="ml-2 hover:text-blue-600">
                                            <XMarkIcon className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}

                                {selectedCategory !== "all" && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {categories?.find((cat: Category) => cat._id === selectedCategory)?.name}
                                        <button onClick={() => setSelectedCategory("all")} className="ml-2 hover:text-green-600">
                                            <XMarkIcon className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}

                                {selectedSubCategory !== "all" && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {selectedSubCategory}
                                        <button onClick={() => setSelectedSubCategory("all")} className="ml-2 hover:text-purple-600">
                                            <XMarkIcon className="w-3 h-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Grid de productos */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product: Product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        /* Estado vacío */
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                {activeFiltersCount > 0 ? (
                                    <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                                ) : (
                                    <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
                                )}
                            </div>

                            {activeFiltersCount > 0 ? (
                                <>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                                    <p className="text-gray-500 mb-6">No hay productos que coincidan con los filtros seleccionados.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <XMarkIcon className="w-5 h-5 mr-2" />
                                        Limpiar filtros
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">No hay productos</h3>
                                    <p className="text-gray-500 mb-6">Comienza agregando tu primer producto para empezar a vender</p>
                                    <button
                                        onClick={() => navigate(location.pathname + `?addProduct`)}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Crear primer producto
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <AddProductModal />
                <ProductDetailModal />
                {showEditModal && <EditProductModal categories={categories} />}
            </div>
        );
};

export default Products;
