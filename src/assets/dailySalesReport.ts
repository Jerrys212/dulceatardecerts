import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import api from "../lib";

// Configurar las fuentes correctamente
(pdfMake as any).vfs = pdfFonts.vfs;

interface SalesData {
    status: number;
    message: string;
    data: {
        date: string;
        totalAmount: number;
        topProducts: Array<{
            count: number;
            total: number;
            name: string;
            category: string;
        }>;
    };
    error: null;
}

export const generateSalesReportPDF = (salesData: SalesData) => {
    const { data } = salesData;
    const formattedDate = new Date(data.date).toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Calcular estadísticas adicionales
    const totalProducts = data.topProducts.reduce((sum, product) => sum + product.count, 0);
    const averageTicket = data.totalAmount / totalProducts;

    // Preparar datos de productos para la tabla
    const productTableData = data.topProducts.map((product, index) => [
        { text: `${index + 1}`, style: "tableNumber" },
        { text: product.name, style: "tableProduct" },
        { text: product.category, style: "tableCategory" },
        { text: product.count.toString(), style: "tableCenter" },
        { text: `${product.total.toLocaleString("es-MX")}`, style: "tableAmount" },
    ]);

    const documentDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        pageMargins: [40, 60, 40, 60],

        // Definir estilos
        styles: {
            header: {
                fontSize: 28,
                bold: true,
                color: "#2563EB", // blue-600
                alignment: "center",
                margin: [0, 0, 0, 20],
            },
            subheader: {
                fontSize: 16,
                color: "#6B7280", // gray-500
                alignment: "center",
                margin: [0, 0, 0, 30],
            },
            sectionTitle: {
                fontSize: 18,
                bold: true,
                color: "#9333EA", // purple-600
                margin: [0, 20, 0, 10],
            },
            summaryCard: {
                fontSize: 14,
                margin: [10, 10, 10, 10],
            },
            summaryValue: {
                fontSize: 20,
                bold: true,
                color: "#2563EB", // blue-600
            },
            summaryLabel: {
                fontSize: 12,
                color: "#6B7280", // gray-500
            },
            tableHeader: {
                fontSize: 12,
                bold: true,
                color: "#FFFFFF",
                fillColor: "#2563EB", // blue-600
                alignment: "center",
            },
            tableNumber: {
                fontSize: 11,
                alignment: "center",
                color: "#6B7280", // gray-500
            },
            tableProduct: {
                fontSize: 11,
                bold: true,
                color: "#1F2937", // gray-800
            },
            tableCategory: {
                fontSize: 10,
                color: "#9333EA", // purple-600
                italics: true,
            },
            tableCenter: {
                fontSize: 11,
                alignment: "center",
                color: "#374151", // gray-700
            },
            tableAmount: {
                fontSize: 11,
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
            barLabel: {
                fontSize: 10,
                color: "#1F2937", // gray-800
                margin: [0, 8, 0, 0],
            },
            barValue: {
                fontSize: 10,
                color: "#9333EA", // purple-600
                alignment: "right",
                margin: [0, 8, 0, 0],
                bold: true,
            },
        },

        content: [
            // Header principal
            {
                text: "REPORTE DE VENTAS",
                style: "header",
            },
            {
                text: formattedDate,
                style: "subheader",
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

            // Resumen ejecutivo en cards
            {
                columns: [
                    {
                        width: "33%",
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
                                                    { text: "Ventas Totales", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#ECF0F1",
                                                border: [false, false, false, false],
                                                margin: [10, 15, 10, 15],
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
                        width: "33%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    { text: totalProducts.toString(), style: "summaryValue", alignment: "center" },
                                                    { text: "Productos Vendidos", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#ECF0F1",
                                                border: [false, false, false, false],
                                                margin: [10, 15, 10, 15],
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
                        width: "33%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    { text: `$${averageTicket.toFixed(0)}`, style: "summaryValue", alignment: "center" },
                                                    { text: "Ticket Promedio", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#ECF0F1",
                                                border: [false, false, false, false],
                                                margin: [10, 15, 10, 15],
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
                columnGap: 10,
                margin: [0, 0, 0, 30],
            },

            // Título de la tabla
            {
                text: "PRODUCTOS MÁS VENDIDOS",
                style: "sectionTitle",
            },

            // Tabla de productos
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
                        ...productTableData,
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
export const downloadSalesReport = async () => {
    const { data } = await api("/reports/daily");

    const docDefinition = generateSalesReportPDF(data);
    const defaultFilename = `reporte-ventas-${data.data.date}.pdf`;

    (pdfMake as any).createPdf(docDefinition).download(defaultFilename);
};

// Función para abrir el PDF en una nueva ventana
export const openSalesReport = (salesData: SalesData) => {
    const docDefinition = generateSalesReportPDF(salesData);
    (pdfMake as any).createPdf(docDefinition).open();
};
