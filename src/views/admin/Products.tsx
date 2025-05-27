import { PlusIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import ProductCard from "../../components/products/ProductsCard";
import Spinner from "../../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/Products.Service";
import ProductDetailModal from "../../components/products/ProductDetailModal";
import AddProductModal from "../../components/products/AddProductModal";
import EditProductModal from "../../components/products/EditProductModal";
import { getCategories } from "../../services/Category.Service";

const Products = () => {
    const navigate = useNavigate();

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

    if (isLoading) return <Spinner />;

    if (data)
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                            <p className="mt-2 text-gray-600">Gestiona tu catálogo completo de productos y servicios</p>
                        </div>

                        <button
                            onClick={() => navigate(location.pathname + `?addProduct`)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105 transition-all duration-200"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Agregar Producto
                        </button>
                    </div>

                    {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Productos</dt>
                                            <dd className="text-lg font-medium text-gray-900">{data.length}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Precio Promedio</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                ${Math.round(data.reduce((acc, p) => acc + p.price, 0) / data.length)}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <TagIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Activos</dt>
                                            <dd className="text-lg font-medium text-green-600">{data.filter((p) => p.isActive).length}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <TagIcon className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Categorías</dt>
                                            <dd className="text-lg font-medium text-gray-900">{new Set(data.map((p) => p.category.name)).size}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Grid de cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {data.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {/* Estado vacío si no hay productos */}
                    {data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay productos</h3>
                            <p className="text-gray-500 mb-6">Comienza agregando tu primer producto para empezar a vender</p>
                            <button
                                onClick={() => {}}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Crear primer producto
                            </button>
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
