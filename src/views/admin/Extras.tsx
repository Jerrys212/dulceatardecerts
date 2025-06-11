import { PlusIcon, CubeIcon } from "@heroicons/react/24/outline";

import Spinner from "../../components/Spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import AddExtraModal from "../../components/extras/AddExtraModal";

import { useSocket } from "../../context/useSocket";
import { useEffect } from "react";
import { Extra } from "../../types";
import { getExtras } from "../../services/Extras.Service";
import ExtraDetailModal from "../../components/extras/ExtraDetailModal";
import EditExtraModal from "../../components/extras/EditExtraModal";
import ExtraCard from "../../components/extras/ExtraCard";

const Extras = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isConnected, on, off } = useSocket();

    const { data, isLoading } = useQuery({
        queryKey: ["extras"],
        queryFn: getExtras,
        retry: false,
    });

    const showEditModal = new URLSearchParams(location.search).has("editExtra");

    useEffect(() => {
        if (!isConnected) return;

        const refreshAllData = () => {
            queryClient.invalidateQueries({ queryKey: ["extras"] });
        };

        const eventsToListen = ["newExtra", "deletedExtra", "updatedExtra"];

        eventsToListen.forEach((event) => {
            on(event, refreshAllData);
        });

        return () => {
            eventsToListen.forEach((event) => {
                off(event);
            });
        };
    }, [on, off, isConnected, queryClient]);

    if (isLoading) return <Spinner />;

    if (data)
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900">Extras</h1>
                            <p className="mt-2 text-gray-600">Gestiona los extras adicionales para tus productos</p>
                        </div>

                        <button
                            onClick={() => navigate(location.pathname + `?addExtra`)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105 transition-all duration-200"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Agregar Extra
                        </button>
                    </div>

                    {data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {data.map((extra: Extra) => (
                                <ExtraCard key={extra._id} extra={extra} />
                            ))}
                        </div>
                    ) : (
                        /* Estado vacío */
                        <div className="text-center py-12">
                            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <CubeIcon className="w-12 h-12 text-gray-400" />
                            </div>

                            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay extras</h3>
                            <p className="text-gray-500 mb-6">Comienza agregando tu primer extra para complementar tus productos</p>
                            <button
                                onClick={() => navigate(location.pathname + `?addExtra`)}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                            >
                                <PlusIcon className="w-5 h-5 mr-2" />
                                Crear primer extra
                            </button>
                        </div>
                    )}
                </div>

                <AddExtraModal />
                <ExtraDetailModal />
                {showEditModal && <EditExtraModal />}
            </div>
        );
};

export default Extras;
