import { isAxiosError } from "axios";
import api from "../lib";
import { Sale, SaleFormData, SaleSchema, SalesSchema } from "../types";

type SaleAPI = {
    formData: SaleFormData;
    saleId: Sale["_id"];
    status: Sale["status"];
};

export const getSales = async () => {
    try {
        const { data } = await api.get("/sales");
        const response = SalesSchema.safeParse(data.data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const getSaleById = async ({ saleId }: Pick<SaleAPI, "saleId">) => {
    try {
        const { data } = await api.get(`/sales/${saleId}`);
        const response = SaleSchema.safeParse(data.data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const createSale = async ({ formData }: Pick<SaleAPI, "formData">) => {
    try {
        const { data } = await api.post("/sales", formData);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const updateSale = async ({ saleId, formData }: Pick<SaleAPI, "saleId" | "formData">) => {
    try {
        const { data } = await api.put(`/sales/${saleId}`, formData);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const updateSaleStatus = async ({ saleId, status }: Pick<SaleAPI, "saleId" | "status">) => {
    try {
        const { data } = await api.patch(`/sales/${saleId}/status`, { status });

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};
