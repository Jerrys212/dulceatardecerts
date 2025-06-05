import { CalendarDaysIcon, ChartBarIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import ReportCard from "../../components/reports/ReportCard";
import { downloadSalesReport } from "../../assets/dailySalesReport";
import { downloadDateRangeSalesReport } from "../../assets/dateRangeReport";
import { downloadProductsPerformanceReport } from "../../assets/topProductsReport";
import { downloadCategoryPerformanceReport } from "../../assets/categoryReport";

const Reports = () => {
    const reports = [
        {
            title: "Reporte Diario",
            description: "Genera un resumen completo de las ventas del día actual, incluyendo totales, productos vendidos y métricas principales.",
            icon: ClockIcon,
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-600",
            gradientColors: "bg-gradient-to-r from-blue-500 to-indigo-500",
            onGenerateReport: downloadSalesReport,
            requiresDateRange: false,
        },
        {
            title: "Reporte por Fechas",
            description: "Analiza las ventas en un período específico. Perfecto para revisar el rendimiento semanal, mensual o trimestral.",
            icon: CalendarDaysIcon,
            iconBgColor: "bg-green-100",
            iconColor: "text-green-600",
            gradientColors: "bg-gradient-to-r from-green-500 to-emerald-500",
            onGenerateReport: downloadDateRangeSalesReport,
            requiresDateRange: true,
        },
        {
            title: "Productos Más Vendidos",
            description: "Identifica cuáles son tus productos estrella y los que más ingresos generan en el período seleccionado.",
            icon: ChartBarIcon,
            iconBgColor: "bg-purple-100",
            iconColor: "text-purple-600",
            gradientColors: "bg-gradient-to-r from-purple-500 to-pink-500",
            onGenerateReport: downloadProductsPerformanceReport,
            requiresDateRange: true,
        },
        {
            title: "Rendimiento por Categorías",
            description: "Compara el desempeño de diferentes categorías de productos para optimizar tu inventario y estrategia de ventas.",
            icon: TagIcon,
            iconBgColor: "bg-orange-100",
            iconColor: "text-orange-600",
            gradientColors: "bg-gradient-to-r from-orange-500 to-red-500",
            onGenerateReport: downloadCategoryPerformanceReport,
            requiresDateRange: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
                    <p className="mt-2 text-gray-600">Genera reportes detallados de ventas en formato PDF o Excel para análisis y presentaciones</p>
                </div>

                {/* Grid de tarjetas de reportes */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                    {reports.map((report, index) => (
                        <ReportCard
                            key={index}
                            title={report.title}
                            description={report.description}
                            icon={report.icon}
                            iconBgColor={report.iconBgColor}
                            iconColor={report.iconColor}
                            gradientColors={report.gradientColors}
                            onGenerateReport={report.onGenerateReport}
                            requiresDateRange={report.requiresDateRange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;
