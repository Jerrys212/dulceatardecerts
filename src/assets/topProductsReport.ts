import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { DateRange } from "../types";
import api from "../lib";

// Configurar las fuentes correctamente
(pdfMake as any).vfs = pdfFonts.vfs;

interface ProductsPerformanceData {
    status: number;
    message: string;
    data: {
        period: {
            startDate: string;
            endDate: string;
        };
        summary: {
            totalProductsSold: number;
            totalAmount: number;
            uniqueProductsSold: number;
            totalActiveProducts: number;
        };
        topProducts: Array<{
            count: number;
            total: number;
            name: string;
            productId: string;
        }>;
        bottomProducts: Array<{
            count: number;
            total: number;
            name: string;
            productId: string;
        }>;
        notSoldProducts: Array<any>;
    };
    error: null;
}

export const generateProductsPerformanceReportPDF = (salesData: ProductsPerformanceData) => {
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
    const averageProductValue = data.summary.uniqueProductsSold > 0 ? data.summary.totalAmount / data.summary.uniqueProductsSold : 0;
    // const salesRate = data.summary.totalActiveProducts > 0 ? (data.summary.uniqueProductsSold / data.summary.totalActiveProducts) * 100 : 0;

    // Preparar datos de productos top
    const topProductsTableData = data.topProducts.map((product, index) => [
        { text: `${index + 1}`, style: "tableNumber" },
        { text: product.name, style: "tableProduct" },
        { text: product.productId.slice(-8).toUpperCase(), style: "tableProductId" },
        { text: product.count.toString(), style: "tableCenter" },
        { text: `$${product.total.toLocaleString("es-MX")}`, style: "tableAmount" },
    ]);

    // Preparar datos de productos bottom
    const bottomProductsTableData = data.bottomProducts.map((product, index) => [
        { text: `${index + 1}`, style: "tableNumber" },
        { text: product.name, style: "tableProduct" },
        { text: product.productId.slice(-8).toUpperCase(), style: "tableProductId" },
        { text: product.count.toString(), style: "tableCenter" },
        { text: `$${product.total.toLocaleString("es-MX")}`, style: "tableAmount" },
    ]);

    const documentDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        pageMargins: [40, 60, 40, 60],

        // Definir estilos
        styles: {
            header: {
                fontSize: 24,
                bold: true,
                color: "#2563EB", // blue-600
                alignment: "center",
                margin: [0, 0, 0, 10],
            },
            subheader: {
                fontSize: 16,
                color: "#6B7280", // gray-500
                alignment: "center",
                margin: [0, 0, 0, 8],
            },
            dateRange: {
                fontSize: 14,
                color: "#9333EA", // purple-600
                alignment: "center",
                margin: [0, 0, 0, 25],
                bold: true,
            },
            sectionTitle: {
                fontSize: 16,
                bold: true,
                color: "#1F2937", // gray-800
                margin: [0, 20, 0, 12],
                decoration: "underline",
                decorationColor: "#9333EA",
            },
            sectionTitleTop: {
                fontSize: 15,
                bold: true,
                color: "#059669", // emerald-600
                margin: [0, 20, 0, 10],
            },
            sectionTitleBottom: {
                fontSize: 15,
                bold: true,
                color: "#DC2626", // red-600
                margin: [0, 25, 0, 10],
            },
            sectionTitleNotSold: {
                fontSize: 15,
                bold: true,
                color: "#7C2D12", // amber-800
                margin: [0, 25, 0, 10],
            },
            summaryValue: {
                fontSize: 16,
                bold: true,
                color: "#2563EB", // blue-600
            },
            summaryLabel: {
                fontSize: 10,
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
            tableProductId: {
                fontSize: 9,
                color: "#9333EA", // purple-600
                italics: true,
                alignment: "center",
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
            notSoldMessage: {
                fontSize: 12,
                color: "#7C2D12", // amber-800
                alignment: "center",
                italics: true,
                margin: [0, 20, 0, 0],
            },
            insightBox: {
                fontSize: 11,
                color: "#374151", // gray-700
                margin: [15, 10, 15, 10],
            },
        },

        content: [
            // Header principal
            {
                text: "REPORTE DE RENDIMIENTO",
                style: "header",
            },
            {
                text: "Análisis de Productos",
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

            // Resumen ejecutivo en grid 2x2
            {
                columns: [
                    {
                        width: "50%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    {
                                                        text: `$${data.summary.totalAmount.toLocaleString("es-MX")}`,
                                                        style: "summaryValue",
                                                        alignment: "center",
                                                    },
                                                    { text: "Ingresos Totales", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#EBF8FF", // blue-50
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
                        width: "50%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    { text: data.summary.totalProductsSold.toString(), style: "summaryValue", alignment: "center" },
                                                    { text: "Productos Vendidos", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#F0FDF4", // green-50
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
                margin: [0, 0, 0, 10],
            },

            // Segunda fila del resumen
            {
                columns: [
                    {
                        width: "50%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    { text: data.summary.uniqueProductsSold.toString(), style: "summaryValue", alignment: "center" },
                                                    { text: "Productos Únicos", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#FDF4FF", // purple-50
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
                        width: "50%",
                        stack: [
                            {
                                table: {
                                    widths: ["*"],
                                    body: [
                                        [
                                            {
                                                stack: [
                                                    { text: `$${averageProductValue.toFixed(0)}`, style: "summaryValue", alignment: "center" },
                                                    { text: "Valor Promedio", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#FFFBEB", // amber-50
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
                margin: [0, 0, 0, 25],
            },

            // Productos con mejor rendimiento
            {
                text: "🚀 PRODUCTOS CON MEJOR RENDIMIENTO",
                style: "sectionTitleTop",
            },

            // Tabla de productos top
            {
                table: {
                    headerRows: 1,
                    widths: ["8%", "40%", "22%", "15%", "15%"],
                    body: [
                        // Header
                        [
                            { text: "#", style: "tableHeader" },
                            { text: "PRODUCTO", style: "tableHeader" },
                            { text: "ID PRODUCTO", style: "tableHeader" },
                            { text: "CANTIDAD", style: "tableHeader" },
                            { text: "TOTAL", style: "tableHeader" },
                        ],
                        // Datos
                        ...topProductsTableData,
                    ],
                },
                layout: {
                    fillColor: (rowIndex: number) => {
                        return rowIndex === 0 ? "#2563EB" : rowIndex % 2 === 0 ? "#F0FDF4" : null; // blue-600 y green-50
                    },
                    hLineWidth: (i: number, node: any) => {
                        return i === 0 || i === node.table.body.length ? 2 : 1;
                    },
                    vLineWidth: () => 0,
                    hLineColor: (i: number, node: any) => {
                        return i === 0 || i === node.table.body.length ? "#2563EB" : "#D1FAE5"; // blue-600 y green-100
                    },
                },
                margin: [0, 0, 0, 20],
            },

            // Productos con menor rendimiento
            {
                text: "📊 PRODUCTOS CON MENOR RENDIMIENTO",
                style: "sectionTitleBottom",
            },

            // Tabla de productos bottom
            {
                table: {
                    headerRows: 1,
                    widths: ["8%", "40%", "22%", "15%", "15%"],
                    body: [
                        // Header
                        [
                            { text: "#", style: "tableHeader" },
                            { text: "PRODUCTO", style: "tableHeader" },
                            { text: "ID PRODUCTO", style: "tableHeader" },
                            { text: "CANTIDAD", style: "tableHeader" },
                            { text: "TOTAL", style: "tableHeader" },
                        ],
                        // Datos
                        ...bottomProductsTableData,
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
                margin: [0, 0, 0, 20],
            },

            // Productos no vendidos
            {
                text: "⚠️ PRODUCTOS SIN VENTAS",
                style: "sectionTitleNotSold",
            },

            // Mensaje condicional para productos no vendidos
            data.notSoldProducts.length > 0
                ? {
                      table: {
                          headerRows: 1,
                          widths: ["10%", "45%", "25%", "20%"],
                          body: [
                              [
                                  { text: "#", style: "tableHeader" },
                                  { text: "PRODUCTO", style: "tableHeader" },
                                  { text: "ID PRODUCTO", style: "tableHeader" },
                                  { text: "ESTADO", style: "tableHeader" },
                              ],
                              // Aquí irían los productos no vendidos cuando los haya
                          ],
                      },
                  }
                : {
                      text: "✅ ¡Excelente! Todos los productos activos tuvieron ventas en este período.",
                      style: "notSoldMessage",
                  },

            // Insights box
            {
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                stack: [
                                    { text: "💡 INSIGHTS DEL REPORTE", fontSize: 12, bold: true, color: "#1F2937", margin: [0, 0, 0, 8] },
                                    {
                                        text: `• Rendimiento general: ${
                                            data.summary.uniqueProductsSold
                                        } productos únicos generaron $${data.summary.totalAmount.toLocaleString("es-MX")} en ingresos.`,
                                        style: "insightBox",
                                    },
                                    {
                                        text: `• Valor promedio por producto: $${averageProductValue.toFixed(0)} pesos por producto único.`,
                                        style: "insightBox",
                                    },
                                    {
                                        text: `• Oportunidad: ${
                                            data.notSoldProducts.length === 0
                                                ? "Todos los productos están funcionando bien."
                                                : `${data.notSoldProducts.length} productos necesitan atención.`
                                        }`,
                                        style: "insightBox",
                                    },
                                ],
                                fillColor: "#F8FAFC", // slate-50
                                border: [false, false, false, false],
                                margin: [15, 15, 15, 15],
                            },
                        ],
                    ],
                },
                layout: {
                    defaultBorder: false,
                },
                margin: [0, 20, 0, 0],
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
export const downloadProductsPerformanceReport = async (dateRange?: DateRange) => {
    const { data } = await api.post("/reports/top-products", dateRange);

    const docDefinition = generateProductsPerformanceReportPDF(data);
    const defaultFilename = `reporte-productos-${data.data.period.startDate}_${data.data.period.endDate}.pdf`;

    (pdfMake as any).createPdf(docDefinition).download(defaultFilename);
};

// Función para abrir el PDF en una nueva ventana
export const openProductsPerformanceReport = (salesData: ProductsPerformanceData) => {
    const docDefinition = generateProductsPerformanceReportPDF(salesData);
    (pdfMake as any).createPdf(docDefinition).open();
};
