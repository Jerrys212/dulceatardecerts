import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import api from "../lib";
import { DateRange } from "../types";

// Configurar las fuentes correctamente
(pdfMake as any).vfs = pdfFonts.vfs;

interface CategoryPerformanceData {
    status: number;
    message: string;
    data: {
        period: {
            startDate: string;
            endDate: string;
        };
        summary: {
            totalCategories: number;
            categoriesWithSales: number;
            topCategoryByRevenue: {
                categoryId: string;
                name: string;
                itemsSold: number;
                total: number;
                uniqueProducts: number;
                salesCount: number;
                averagePerSale: number;
                percentOfTotalSales: number;
            };
            topCategoryByQuantity: {
                categoryId: string;
                name: string;
                itemsSold: number;
                total: number;
                uniqueProducts: number;
                salesCount: number;
                averagePerSale: number;
                percentOfTotalSales: number;
            };
        };
        categoryReports: Array<{
            categoryId: string;
            name: string;
            itemsSold: number;
            total: number;
            uniqueProducts: number;
            salesCount: number;
            averagePerSale: number;
            percentOfTotalSales: number;
        }>;
    };
    error: null;
}

export const generateCategoryPerformanceReportPDF = (salesData: CategoryPerformanceData) => {
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

    // Separar categorías con y sin ventas
    const categoriesWithSales = data.categoryReports.filter((cat) => cat.total > 0);
    const categoriesWithoutSales = data.categoryReports.filter((cat) => cat.total === 0);

    // Calcular total general para verificación
    const totalRevenue = data.categoryReports.reduce((sum, cat) => sum + cat.total, 0);

    // Preparar datos de categorías con ventas
    const categoriesWithSalesTableData = categoriesWithSales.map((category, index) => [
        { text: `${index + 1}`, style: "tableNumber" },
        { text: category.name, style: "tableCategory" },
        { text: category.itemsSold.toString(), style: "tableCenter" },
        { text: category.uniqueProducts.toString(), style: "tableCenter" },
        { text: `$${category.averagePerSale.toFixed(0)}`, style: "tableAverage" },
        { text: `${category.percentOfTotalSales}%`, style: "tablePercent" },
        { text: `$${category.total.toLocaleString("es-MX")}`, style: "tableAmount" },
    ]);

    // Preparar datos de categorías sin ventas
    const categoriesWithoutSalesTableData = categoriesWithoutSales.map((category, index) => [
        { text: `${index + 1}`, style: "tableNumber" },
        { text: category.name, style: "tableCategory" },
        { text: category.categoryId.slice(-8).toUpperCase(), style: "tableCategoryId" },
        { text: "Sin ventas", style: "tableNoSales" },
    ]);

    const documentDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        pageMargins: [40, 60, 40, 60],

        // Definir estilos
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                color: "#2563EB", // blue-600
                alignment: "center",
                margin: [0, 0, 0, 8],
            },
            subheader: {
                fontSize: 16,
                color: "#6B7280", // gray-500
                alignment: "center",
                margin: [0, 0, 0, 6],
            },
            dateRange: {
                fontSize: 14,
                color: "#9333EA", // purple-600
                alignment: "center",
                margin: [0, 0, 0, 20],
                bold: true,
            },
            sectionTitle: {
                fontSize: 16,
                bold: true,
                color: "#1F2937", // gray-800
                margin: [0, 18, 0, 10],
                decoration: "underline",
                decorationColor: "#9333EA",
            },
            sectionTitlePerforming: {
                fontSize: 15,
                bold: true,
                color: "#059669", // emerald-600
                margin: [0, 20, 0, 10],
            },
            sectionTitleUnderperforming: {
                fontSize: 15,
                bold: true,
                color: "#DC2626", // red-600
                margin: [0, 25, 0, 10],
            },
            summaryValue: {
                fontSize: 16,
                bold: true,
                color: "#2563EB", // blue-600
            },
            summaryValueLarge: {
                fontSize: 18,
                bold: true,
                color: "#059669", // emerald-600
            },
            summaryLabel: {
                fontSize: 10,
                color: "#6B7280", // gray-500
            },
            championLabel: {
                fontSize: 11,
                color: "#059669", // emerald-600
                bold: true,
            },
            tableHeader: {
                fontSize: 10,
                bold: true,
                color: "#FFFFFF",
                fillColor: "#2563EB", // blue-600
                alignment: "center",
            },
            tableNumber: {
                fontSize: 9,
                alignment: "center",
                color: "#6B7280", // gray-500
            },
            tableCategory: {
                fontSize: 10,
                bold: true,
                color: "#1F2937", // gray-800
            },
            tableCategoryId: {
                fontSize: 9,
                color: "#9333EA", // purple-600
                italics: true,
                alignment: "center",
            },
            tableCenter: {
                fontSize: 9,
                alignment: "center",
                color: "#374151", // gray-700
            },
            tableAverage: {
                fontSize: 9,
                alignment: "center",
                color: "#7C2D12", // amber-800
                bold: true,
            },
            tablePercent: {
                fontSize: 9,
                alignment: "center",
                color: "#9333EA", // purple-600
                bold: true,
            },
            tableAmount: {
                fontSize: 9,
                alignment: "right",
                bold: true,
                color: "#059669", // emerald-600
            },
            tableNoSales: {
                fontSize: 9,
                alignment: "center",
                color: "#DC2626", // red-600
                italics: true,
            },
            footer: {
                fontSize: 10,
                color: "#9CA3AF", // gray-400
                alignment: "center",
                margin: [0, 20, 0, 0],
            },
            insightBox: {
                fontSize: 11,
                color: "#374151", // gray-700
                margin: [15, 8, 15, 8],
            },
            championBox: {
                fontSize: 11,
                color: "#065F46", // emerald-800
                margin: [15, 10, 15, 10],
            },
        },

        content: [
            // Header principal
            {
                text: "RENDIMIENTO POR CATEGORÍAS",
                style: "header",
            },
            {
                text: "Análisis de Performance",
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
                margin: [0, 0, 0, 18] as [number, number, number, number],
            },

            // Resumen general
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
                                                    { text: data.summary.totalCategories.toString(), style: "summaryValue", alignment: "center" },
                                                    { text: "Total Categorías", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#EBF8FF", // blue-50
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
                                                    { text: data.summary.categoriesWithSales.toString(), style: "summaryValue", alignment: "center" },
                                                    { text: "Con Ventas", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#F0FDF4", // green-50
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
                                                    {
                                                        text: (data.summary.totalCategories - data.summary.categoriesWithSales).toString(),
                                                        style: "summaryValue",
                                                        alignment: "center",
                                                    },
                                                    { text: "Sin Ventas", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#FEF2F2", // red-50
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
                                                    { text: `$${totalRevenue.toLocaleString("es-MX")}`, style: "summaryValue", alignment: "center" },
                                                    { text: "Ingresos Totales", style: "summaryLabel", alignment: "center" },
                                                ],
                                                fillColor: "#FDF4FF", // purple-50
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
                margin: [0, 0, 0, 20] as [number, number, number, number],
            },

            // Categorías campeonas
            {
                text: "🏆 CATEGORÍAS CAMPEONAS",
                style: "sectionTitle",
            },

            // Champions info
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
                                                    { text: "CAMPEÓN EN INGRESOS", style: "championLabel", alignment: "center" },
                                                    { text: data.summary.topCategoryByRevenue.name, style: "summaryValueLarge", alignment: "center" },
                                                    {
                                                        text: `$${data.summary.topCategoryByRevenue.total.toLocaleString("es-MX")} (${
                                                            data.summary.topCategoryByRevenue.percentOfTotalSales
                                                        }%)`,
                                                        fontSize: 11,
                                                        color: "#065F46",
                                                        alignment: "center",
                                                        margin: [0, 4, 0, 0],
                                                    },
                                                ],
                                                fillColor: "#ECFDF5", // green-50
                                                border: [false, false, false, false],
                                                margin: [12, 15, 12, 15],
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
                                                    { text: "CAMPEÓN EN CANTIDAD", style: "championLabel", alignment: "center" },
                                                    {
                                                        text: data.summary.topCategoryByQuantity.name,
                                                        style: "summaryValueLarge",
                                                        alignment: "center",
                                                    },
                                                    {
                                                        text: `${data.summary.topCategoryByQuantity.itemsSold} productos vendidos`,
                                                        fontSize: 11,
                                                        color: "#065F46",
                                                        alignment: "center",
                                                        margin: [0, 4, 0, 0],
                                                    },
                                                ],
                                                fillColor: "#ECFDF5", // green-50
                                                border: [false, false, false, false],
                                                margin: [12, 15, 12, 15],
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
                margin: [0, 0, 0, 20],
            },

            // Categorías con ventas
            {
                text: "📈 CATEGORÍAS CON VENTAS",
                style: "sectionTitlePerforming",
            },

            // Tabla de categorías con ventas
            categoriesWithSales.length > 0
                ? {
                      table: {
                          headerRows: 1,
                          widths: ["6%", "20%", "12%", "12%", "15%", "12%", "15%"],
                          body: [
                              // Header
                              [
                                  { text: "#", style: "tableHeader" },
                                  { text: "CATEGORÍA", style: "tableHeader" },
                                  { text: "VENDIDOS", style: "tableHeader" },
                                  { text: "PRODUCTOS", style: "tableHeader" },
                                  { text: "PROMEDIO", style: "tableHeader" },
                                  { text: "% VENTAS", style: "tableHeader" },
                                  { text: "TOTAL", style: "tableHeader" },
                              ],
                              // Datos
                              ...categoriesWithSalesTableData,
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
                  }
                : {
                      text: "No hay categorías con ventas en este período.",
                      style: "tableNoSales",
                      alignment: "center",
                      margin: [0, 10, 0, 20],
                  },

            // Categorías sin ventas (solo si las hay)
            ...(categoriesWithoutSales.length > 0
                ? [
                      {
                          text: "⚠️ CATEGORÍAS SIN VENTAS",
                          style: "sectionTitleUnderperforming",
                      },
                      {
                          table: {
                              headerRows: 1,
                              widths: ["10%", "40%", "25%", "25%"],
                              body: [
                                  // Header
                                  [
                                      { text: "#", style: "tableHeader" },
                                      { text: "CATEGORÍA", style: "tableHeader" },
                                      { text: "ID CATEGORÍA", style: "tableHeader" },
                                      { text: "ESTADO", style: "tableHeader" },
                                  ],
                                  // Datos
                                  ...categoriesWithoutSalesTableData,
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
                          margin: [0, 0, 0, 20] as [number, number, number, number],
                      },
                  ]
                : []),

            // Insights box
            {
                table: {
                    widths: ["*"],
                    body: [
                        [
                            {
                                stack: [
                                    { text: "📊 ANÁLISIS DE PERFORMANCE", fontSize: 12, bold: true, color: "#1F2937", margin: [0, 0, 0, 8] },
                                    {
                                        text: `• Tasa de actividad: ${(
                                            (data.summary.categoriesWithSales / data.summary.totalCategories) *
                                            100
                                        ).toFixed(1)}% de las categorías tuvieron ventas.`,
                                        style: "insightBox",
                                    },
                                    {
                                        text: `• Categoría líder: "${data.summary.topCategoryByRevenue.name}" domina con ${data.summary.topCategoryByRevenue.percentOfTotalSales}% de las ventas totales.`,
                                        style: "insightBox",
                                    },
                                    {
                                        text: `• Promedio por venta más alto: $${data.summary.topCategoryByRevenue.averagePerSale} en "${data.summary.topCategoryByRevenue.name}".`,
                                        style: "insightBox",
                                    },
                                    categoriesWithoutSales.length > 0
                                        ? {
                                              text: `• Oportunidad: ${categoriesWithoutSales.length} categorías necesitan estrategias de promoción.`,
                                              style: "insightBox",
                                          }
                                        : {
                                              text: `• Excelente: Todas las categorías están generando ventas.`,
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
                margin: [0, 15, 0, 0],
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
export const downloadCategoryPerformanceReport = async (dateRange?: DateRange) => {
    const { data } = await api.post("/reports/categories", dateRange);

    const docDefinition = generateCategoryPerformanceReportPDF(data);
    const defaultFilename = `reporte-categorias-${data.data.period.startDate}_${data.data.period.endDate}.pdf`;

    (pdfMake as any).createPdf(docDefinition).download(defaultFilename);
};

// Función para abrir el PDF en una nueva ventana
export const openCategoryPerformanceReport = (salesData: CategoryPerformanceData) => {
    const docDefinition = generateCategoryPerformanceReportPDF(salesData);
    (pdfMake as any).createPdf(docDefinition).open();
};
