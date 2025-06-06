import { useState } from "react";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import DateRangeModal from "./DateRangeModal"; // Ajusta la ruta según tu estructura

type DateRange = {
    startDate: string;
    endDate: string;
};

// Función wrapper que maneja ambos casos
type UnifiedReportFunction = (dateRange?: DateRange) => Promise<void>;

type ReportCardProps = {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    iconBgColor: string;
    iconColor: string;
    gradientColors: string;
    onGenerateReport: UnifiedReportFunction;
    requiresDateRange?: boolean;
};

const ReportCard = ({
    title,
    description,
    icon: Icon,
    iconBgColor,
    iconColor,
    gradientColors,
    onGenerateReport,
    requiresDateRange = false,
}: ReportCardProps) => {
    const [showModal, setShowModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async (dateRange?: DateRange) => {
        setIsGenerating(true);
        try {
            // Llamada unificada - la función original decide qué hacer con el parámetro
            await onGenerateReport(dateRange);
            toast.success(`Reporte generado exitosamente`);
        } catch (error) {
            toast.error(`Error al generar el reporte`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleModalGenerate = async (dateRange: DateRange) => {
        await handleGenerate(dateRange);
        setShowModal(false);
    };

    const handleDirectGenerate = async () => {
        if (requiresDateRange) {
            setShowModal(true);
        } else {
            await handleGenerate();
        }
    };

    if (isGenerating) return <Spinner />;

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden group">
                <div className="p-6">
                    {/* Header con icono */}
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${iconBgColor} group-hover:scale-110 transition-transform duration-200`}>
                            <Icon className={`w-8 h-8 ${iconColor}`} />
                        </div>
                        {requiresDateRange && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Rango de fechas</span>
                        )}
                    </div>

                    {/* Contenido */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">{title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                    </div>

                    {/* Botones de acción */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={handleDirectGenerate}
                                disabled={isGenerating}
                                className="flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:scale-105 transition-all duration-200 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <DocumentArrowDownIcon className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                                <span className="font-medium">PDF</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Elemento decorativo */}
                <div
                    className={`h-1 ${gradientColors} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                ></div>
            </div>

            {/* Modal para selección de fechas */}
            <DateRangeModal isOpen={showModal} onClose={() => setShowModal(false)} onGenerate={handleModalGenerate} title={title} />
        </>
    );
};

export default ReportCard;
