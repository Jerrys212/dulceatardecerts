import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface DateRangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (dateRange: { startDate: string; endDate: string }) => void;
    title: string;
}

const DateRangeModal = ({ isOpen, onClose, onGenerate, title }: DateRangeModalProps) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            toast.error("Por favor selecciona ambas fechas");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            toast.error("La fecha de inicio debe ser anterior a la fecha final");
            return;
        }
        onGenerate({ startDate, endDate });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de inicio</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha final</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Generar Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default DateRangeModal;
