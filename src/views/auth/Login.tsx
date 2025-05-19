import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/Auth.Service";
import { LoginFormData } from "../../types";

const LoginComponent = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        defaultValues: {
            username: "",
            password: "",
            rememberMe: false,
        },
    });

    const { mutate } = useMutation({
        mutationFn: login,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            navigate("/dashboard");
        },
    });

    const onSubmit = async (formData: LoginFormData) => mutate(formData);

    return (
        <div className="min-h-screen flex">
            {/* Lado izquierdo - Imagen */}
            <div
                className="hidden md:flex md:w-1/2 bg-gray-100 items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url(/login.jpg)" }}
            ></div>

            {/* Lado derecho - Formulario */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            {/* Campo Usuario */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Usuario
                                </label>
                                <input
                                    {...register("username", {
                                        required: "El usuario es obligatorio",
                                        minLength: {
                                            value: 3,
                                            message: "El usuario debe tener al menos 3 caracteres",
                                        },
                                    })}
                                    type="text"
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 rounded-md sm:text-sm"
                                    placeholder="Ingresa tu usuario"
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                            </div>

                            {/* Campo Contraseña */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <input
                                    {...register("password", {
                                        required: "La contraseña es obligatoria",
                                        minLength: {
                                            value: 6,
                                            message: "La contraseña debe tener al menos 6 caracteres",
                                        },
                                    })}
                                    type="password"
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-primary placeholder-gray-500 text-gray-900 rounded-md sm:text-sm"
                                    placeholder="Ingresa tu contraseña"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            {/* Checkbox Recordar credenciales */}
                            <div className="flex items-center">
                                <input
                                    {...register("rememberMe")}
                                    id="rememberMe"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                                    Recordar mis credenciales
                                </label>
                            </div>
                        </div>

                        {/* Botón de submit */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary disabled:bg-tertiary disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Iniciando sesión...
                                    </span>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default LoginComponent;
