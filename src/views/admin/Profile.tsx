import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserIcon, EnvelopeIcon, KeyIcon, EyeIcon, EyeSlashIcon, PencilIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import { ChangePasswordFormData } from "../../types";
import { changePassword } from "../../services/Auth.Service";

interface UserData {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    role?: string;
}

// Simulación de servicios (reemplaza con tus servicios reales)
const getUserProfile = async (): Promise<UserData> => {
    // Simula llamada a API
    return {
        _id: "1",
        name: "Juan Pérez",
        email: "juan@example.com",
        createdAt: "2024-01-15",
        role: "admin",
    };
};

const UserProfile = () => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const queryClient = useQueryClient();

    // Query para obtener datos del usuario
    const { data: userData, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
    });

    // Formulario para cambio de contraseña
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<ChangePasswordFormData>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const newPassword = watch("newPassword");

    // Mutación para cambio de contraseña
    const { mutate, isPending } = useMutation({
        mutationFn: changePassword,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success(data);
            handleCancelPasswordChange();
        },
        onError: (error: any) => {
            toast.error(error.message || "Error al cambiar la contraseña");
        },
    });

    const handlePasswordSubmit = (data: ChangePasswordFormData) => mutate(data);

    const handleCancelPasswordChange = () => {
        setShowPasswordForm(false);
        reset();
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    if (isLoading) return <Spinner />;

    if (userData)
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                        <p className="mt-2 text-gray-600">Gestiona tu información personal y configuración de seguridad</p>
                    </div>

                    {/* Tarjeta de Perfil */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                        {/* Header de la tarjeta con gradiente */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
                            <div className="flex items-center space-x-6">
                                <div className="p-4 bg-white/20 rounded-2xl">
                                    <UserIcon className="h-12 w-12" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">{userData?.name}</h2>
                                    <p className="text-blue-100 mt-1">{userData?.role === "admin" ? "Administrador" : "Usuario"}</p>
                                    <p className="text-blue-100 text-sm mt-2">
                                        Miembro desde{" "}
                                        {new Date(userData?.createdAt || "").toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información del perfil */}
                        <div className="px-8 py-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                                        <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                                    </div>
                                    <p className="text-lg font-medium text-gray-900">{userData?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Seguridad */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <KeyIcon className="h-6 w-6 text-red-600" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Seguridad</h3>
                                        <p className="text-gray-600">Gestiona tu contraseña y configuración de seguridad</p>
                                    </div>
                                </div>

                                {!showPasswordForm && (
                                    <button
                                        onClick={() => setShowPasswordForm(true)}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105 transition-all duration-200"
                                    >
                                        <PencilIcon className="w-5 h-5 mr-2" />
                                        Cambiar Contraseña
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Formulario de cambio de contraseña */}
                        {showPasswordForm && (
                            <div className="px-8 py-8 bg-gradient-to-br from-red-50 to-pink-50">
                                <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900">Cambiar Contraseña</h4>
                                        <button
                                            type="button"
                                            onClick={handleCancelPasswordChange}
                                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {/* Contraseña actual */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual *</label>
                                        <div className="relative">
                                            <input
                                                {...register("currentPassword", {
                                                    required: "La contraseña actual es obligatoria",
                                                    minLength: {
                                                        value: 6,
                                                        message: "La contraseña debe tener al menos 6 caracteres",
                                                    },
                                                })}
                                                type={showCurrentPassword ? "text" : "password"}
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                                placeholder="Ingresa tu contraseña actual"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
                                    </div>

                                    {/* Nueva contraseña */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña *</label>
                                        <div className="relative">
                                            <input
                                                {...register("newPassword", {
                                                    required: "La nueva contraseña es obligatoria",
                                                    minLength: {
                                                        value: 8,
                                                        message: "La nueva contraseña debe tener al menos 8 caracteres",
                                                    },
                                                    pattern: {
                                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                                        message: "La contraseña debe contener al menos una minúscula, una mayúscula y un número",
                                                    },
                                                })}
                                                type={showNewPassword ? "text" : "password"}
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                                placeholder="Ingresa tu nueva contraseña"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
                                    </div>

                                    {/* Confirmar contraseña */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña *</label>
                                        <div className="relative">
                                            <input
                                                {...register("confirmPassword", {
                                                    required: "Confirma tu nueva contraseña",
                                                    validate: (value) => value === newPassword || "Las contraseñas no coinciden",
                                                })}
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                                                placeholder="Confirma tu nueva contraseña"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleCancelPasswordChange}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors duration-200"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                                                <span className="flex items-center">
                                                    <CheckIcon className="w-5 h-5 mr-2" />
                                                    Actualizar Contraseña
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
};

export default UserProfile;
