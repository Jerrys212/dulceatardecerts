/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#bb99ff", // Azul oscuro - primario
                secondary: "#ff99e6", // Azul más oscuro - secundario
                tertiary: "#ff99ff", // Azul-violeta - terciario
                quaternary: "#12916b", // Verde-azulado - cuarto
            },
        },
    },
    plugins: [],
};
