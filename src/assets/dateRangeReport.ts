import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import api from "../lib";
import { DateRange } from "../types";

// Configurar las fuentes correctamente
(pdfMake as any).vfs = pdfFonts.vfs;

interface DateRangeSalesData {
    status: number;
    message: string;
    data: {
        period: {
            startDate: string;
            endDate: string;
        };
        totalAmount: number;
        topProducts: Array<{
            count: number;
            total: number;
            name: string;
            category: string;
        }>;
        leastSoldProducts: Array<{
            count: number;
            total: number;
            name: string;
            category: string;
        }>;
    };
    error: null;
}

export const generateDateRangeSalesReportPDF = (salesData: DateRangeSalesData) => {
    const { data } = salesData;

    // Formatear las fechas
    const startDate = new Date(data.period.startDate).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const endDate = new Date(data.period.endDate).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // Calcular estadísticas adicionales
    const totalProductsSold = data.topProducts.reduce((sum, product) => sum + product.count, 0);
    const averageTicket = totalProductsSold > 0 ? data.totalAmount / totalProductsSold : 0;
    const numberOfDays = Math.ceil((new Date(data.period.endDate).getTime() - new Date(data.period.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const averagePerDay = data.totalAmount / numberOfDays;

    // Preparar datos de productos más vendidos
    const topProductsTableData = data.topProducts.map((product, index) => [
        { text: `${index + 1}`, style: "tableNumber" },
        { text: product.name, style: "tableProduct" },
        { text: product.category, style: "tableCategory" },
        { text: product.count.toString(), style: "tableCenter" },
        { text: `$${product.total.toLocaleString("es-MX")}`, style: "tableAmount" },
    ]);

    // Preparar datos de productos menos vendidos
    const leastProductsTableData = data.leastSoldProducts.map((product, index) => [
        { text: `${index + 1}`, style: "tableNumber" },
        { text: product.name, style: "tableProduct" },
        { text: product.category, style: "tableCategory" },
        { text: product.count.toString(), style: "tableCenter" },
        { text: `$${product.total.toLocaleString("es-MX")}`, style: "tableAmount" },
    ]);

    const documentDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        pageMargins: [40, 60, 40, 60],

        // Definir estilos
        styles: {
            header: {
                fontSize: 26,
                bold: true,
                color: "#2563EB", // blue-600
                alignment: "center",
                margin: [0, 0, 0, 15],
            },
            subheader: {
                fontSize: 16,
                color: "#6B7280", // gray-500
                alignment: "center",
                margin: [0, 0, 0, 10],
            },
            dateRange: {
                fontSize: 14,
                color: "#9333EA", // purple-600
                alignment: "center",
                margin: [0, 0, 0, 25],
                bold: true,
            },
            sectionTitle: {
                fontSize: 18,
                bold: true,
                color: "#9333EA", // purple-600
                margin: [0, 20, 0, 10],
            },
            sectionTitleTop: {
                fontSize: 16,
                bold: true,
                color: "#059669", // emerald-600
                margin: [0, 15, 0, 8],
                decoration: "underline",
            },
            sectionTitleLeast: {
                fontSize: 16,
                bold: true,
                color: "#DC2626", // red-600
                margin: [0, 25, 0, 8],
                decoration: "underline",
            },
            summaryValue: {
                fontSize: 18,
                bold: true,
                color: "#2563EB", // blue-600
            },
            summaryLabel: {
                fontSize: 11,
                color: "#6B7280", // gray-500
            },
            tableHeader: {
                fontSize: 11,
                bold: true,
                color: "#FFFFFF",
                fillColor: "#2563EB", // blue-600
                alignment: "center",
            },
            tableNumber: {
                fontSize: 10,
                alignment: "center",
                color: "#6B7280", // gray-500
            },
            tableProduct: {
                fontSize: 10,
                bold: true,
                color: "#1F2937", // gray-800
            },
            tableCategory: {
                fontSize: 9,
                color: "#9333EA", // purple-600
                italics: true,
            },
            tableCenter: {
                fontSize: 10,
                alignment: "center",
                color: "#374151", // gray-700
            },
            tableAmount: {
                fontSize: 10,
                alignment: "right",
                bold: true,
                color: "#9333EA", // purple-600
            },
            footer: {
                fontSize: 10,
                color: "#9CA3AF", // gray-400
                alignment: "center",
                margin: [0, 20, 0, 0],
            },
        },

        content: [
            // Header principal
            {
                text: "REPORTE DE VENTAS",
                style: "header",
            },
            {
                text: "Por Rango de Fechas",
                style: "subheader",
            },
            {
                text: `${startDate} - ${endDate}`,
                style: "dateRange",
            },

            // Línea decorativa
            {
                canvas: [
                    {
                        type: "line",
                        x1: 0,
                        y1: 0,
                        x2: 515,
                        y2: 0,
                        lineWidth: 2,
                        lineColor: "#2563EB", // blue-600
                    },
                ],
                margin: [0, 0, 0, 20],
            },

            // Resumen ejecutivo en cards (4 columnas)
            {
                columns: [
                    {
                        width: "25%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    {
                                                        text: `$${data.totalAmount.toLocaleString("es-MX")}`,
                                                        style: "summaryValue",
                                                        alignment: "center",
                                                    },
                                                    { text: "Total Vendido", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#F1F5F9", // slate-100
                                                border: [false, false, false, false],
                                                margin: [8, 12, 8, 12],
                                            },
                                        ],
                                    ],
                                },
                                layout: {
                                    defaultBorder: false,
                                },
                            },
                        ],
                    },
                    {
                        width: "25%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    { text: totalProductsSold.toString(), style: "summaryValue", alignment: "center" },
                                                    { text: "Productos Vendidos", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#F1F5F9", // slate-100
                                                border: [false, false, false, false],
                                                margin: [8, 12, 8, 12],
                                            },
                                        ],
                                    ],
                                },
                                layout: {
                                    defaultBorder: false,
                                },
                            },
                        ],
                    },
                    {
                        width: "25%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    { text: `${numberOfDays} días`, style: "summaryValue", alignment: "center" },
                                                    { text: "Período", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#F1F5F9", // slate-100
                                                border: [false, false, false, false],
                                                margin: [8, 12, 8, 12],
                                            },
                                        ],
                                    ],
                                },
                                layout: {
                                    defaultBorder: false,
                                },
                            },
                        ],
                    },
                    {
                        width: "25%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    { text: `$${averagePerDay.toFixed(0)}`, style: "summaryValue", alignment: "center" },
                                                    { text: "Promedio/Día", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#F1F5F9", // slate-100
                                                border: [false, false, false, false],
                                                margin: [8, 12, 8, 12],
                                            },
                                        ],
                                    ],
                                },
                                layout: {
                                    defaultBorder: false,
                                },
                            },
                        ],
                    },
                ],
                columnGap: 8,
                margin: [0, 0, 0, 25],
            },

            // Productos más vendidos
            {
                text: "🏆 PRODUCTOS MÁS VENDIDOS",
                style: "sectionTitleTop",
            },

            // Tabla de productos más vendidos
            {
                table: {
                    headerRows: 1,
                    widths: ["8%", "37%", "25%", "15%", "15%"],
                    body: [
                        // Header
                        [
                            { text: "#", style: "tableHeader" },
                            { text: "PRODUCTO", style: "tableHeader" },
                            { text: "CATEGORÍA", style: "tableHeader" },
                            { text: "CANTIDAD", style: "tableHeader" },
                            { text: "TOTAL", style: "tableHeader" },
                        ],
                        // Datos
                        ...topProductsTableData,
                    ],
                },
                layout: {
                    fillColor: (rowIndex: number) => {
                        return rowIndex === 0 ? "#2563EB" : rowIndex % 2 === 0 ? "#F8FAFC" : null; // blue-600 y slate-50
                    },
                    hLineWidth: (i: number, node: any) => {
                        return i === 0 || i === node.table.body.length ? 2 : 1;
                    },
                    vLineWidth: () => 0,
                    hLineColor: (i: number, node: any) => {
                        return i === 0 || i === node.table.body.length ? "#2563EB" : "#E2E8F0"; // blue-600 y slate-200
                    },
                },
                margin: [0, 0, 0, 20],
            },

            // Productos menos vendidos
            {
                text: "📉 PRODUCTOS MENOS VENDIDOS",
                style: "sectionTitleLeast",
            },

            // Tabla de productos menos vendidos
            {
                table: {
                    headerRows: 1,
                    widths: ["8%", "37%", "25%", "15%", "15%"],
                    body: [
                        // Header
                        [
                            { text: "#", style: "tableHeader" },
                            { text: "PRODUCTO", style: "tableHeader" },
                            { text: "CATEGORÍA", style: "tableHeader" },
                            { text: "CANTIDAD", style: "tableHeader" },
                            { text: "TOTAL", style: "tableHeader" },
                        ],
                        // Datos
                        ...leastProductsTableData,
                    ],
                },
                layout: {
                    fillColor: (rowIndex: number) => {
                        return rowIndex === 0 ? "#2563EB" : rowIndex % 2 === 0 ? "#FEF2F2" : null; // blue-600 y red-50
                    },
                    hLineWidth: (i: number, node: any) => {
                        return i === 0 || i === node.table.body.length ? 2 : 1;
                    },
                    vLineWidth: () => 0,
                    hLineColor: (i: number, node: any) => {
                        return i === 0 || i === node.table.body.length ? "#2563EB" : "#FEE2E2"; // blue-600 y red-100
                    },
                },
                margin: [0, 0, 0, 30],
            },
        ],

        // Footer
        footer: (currentPage: number, pageCount: number) => {
            return {
                columns: [
                    {
                        text: `Generado el ${new Date().toLocaleDateString("es-MX")} a las ${new Date().toLocaleTimeString("es-MX")}`,
                        style: "footer",
                        alignment: "left",
                    },
                    {
                        text: `Página ${currentPage} de ${pageCount}`,
                        style: "footer",
                        alignment: "right",
                    },
                ],
                margin: [40, 0, 40, 0],
            };
        },
    };

    return documentDefinition;
};

// Función para generar y descargar el PDF
export const downloadDateRangeSalesReport = async (dateRange?: DateRange) => {
    const { data } = await api.post("/reports/date-range", dateRange);

    const docDefinition = generateDateRangeSalesReportPDF(data);
    const defaultFilename = `reporte-rango-${data.data.period.startDate}_${data.data.period.endDate}.pdf`;

    (pdfMake as any).createPdf(docDefinition).download(defaultFilename);
};

// Función para abrir el PDF en una nueva ventana
export const openDateRangeSalesReport = (salesData: DateRangeSalesData) => {
    const docDefinition = generateDateRangeSalesReportPDF(salesData);
    (pdfMake as any).createPdf(docDefinition).open();
};
