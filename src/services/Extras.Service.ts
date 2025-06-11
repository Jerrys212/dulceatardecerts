import { isAxiosError } from "axios";
import api from "../lib";
import { Extra, ExtraFormData, extraSchema, extrasSchema } from "../types";

type ExtraAPI = {
    formData: ExtraFormData;
    extraId: Extra["_id"];
};

export const getExtras = async () => {
    try {
        const { data } = await api.get("/extras");
        const response = extrasSchema.safeParse(data.data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const getExtraById = async ({ extraId }: Pick<ExtraAPI, "extraId">) => {
    try {
        const { data } = await api.get(`/extras/${extraId}`);
        const response = extraSchema.safeParse(data.data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const createExtra = async ({ formData }: Pick<ExtraAPI, "formData">) => {
    try {
        const { data } = await api.post(`/extras`, formData);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const updateExtra = async ({ extraId, formData }: Pick<ExtraAPI, "extraId" | "formData">) => {
    try {
        const { data } = await api.put(`/extras/${extraId}`, formData);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const deleteExtra = async ({ extraId }: Pick<ExtraAPI, "extraId">) => {
    try {
        const { data } = await api.delete(`/extras/${extraId}`);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};
