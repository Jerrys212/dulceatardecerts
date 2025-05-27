import { isAxiosError } from "axios";
import api from "../lib";
import { Product, ProductFormData, productSchema, productsSchema } from "../types";

type ProductAPI = {
    formData: ProductFormData;
    productId: Product["_id"];
};

export const getProducts = async () => {
    try {
        const { data } = await api.get("/products");
        const response = productsSchema.safeParse(data.data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const getProductById = async ({ productId }: Pick<ProductAPI, "productId">) => {
    try {
        const { data } = await api.get(`/products/${productId}`);
        const response = productSchema.safeParse(data.data);

        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const createProduct = async (formData: Pick<ProductAPI, "formData">) => {
    try {
        const { data } = await api.post(`/products`, formData);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const updateProduct = async ({ productId, formData }: Pick<ProductAPI, "productId" | "formData">) => {
    try {
        const { data } = await api.put(`/products/${productId}`, formData);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};

export const deleteProduct = async ({ productId }: Pick<ProductAPI, "productId">) => {
    try {
        const { data } = await api.delete(`/product/${productId}`);

        return data.message;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};
