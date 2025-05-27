import { isAxiosError } from "axios";
import api from "../lib";
import { categoriesSchema, Category, CategoryFormData, categorySchema } from "../types";

type CategoryAPI = {
    formData: CategoryFormData;
    categoryId: Category["_id"];
};

export const getCategories = async () => {
    try {
        const { data } = await api.get("/categories");
        const response = categoriesSchema.safeParse(data.data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const getCategoryById = async (categoryId: Category["_id"]) => {
    try {
        const { data } = await api.get(`/categories/${categoryId}`);
        const response = categorySchema.safeParse(data.data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const createCategory = async (formData: CategoryFormData) => {
    try {
        const { data } = await api.post(`/categories`, formData);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const updateCategory = async ({ categoryId, formData }: Pick<CategoryAPI, "categoryId" | "formData">) => {
    try {
        const { data } = await api.put(`/categories/${categoryId}`, formData);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const deleteCategory = async (categoryId: Category["_id"]) => {
    try {
        const { data } = await api.delete(`/categories/${categoryId}`);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};
