import { isAxiosError } from "axios";
import api from "../lib";
import { Sale, SalesSchema } from "../types";

type SaleAPI = {
    // formData: SaleFormData;
    categoryId: Sale["_id"];
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
