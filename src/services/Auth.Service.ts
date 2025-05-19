import api from "../lib";
import { LoginFormData } from "../types";
import { isAxiosError } from "axios";

export const login = async (formData: LoginFormData) => {
    try {
        const url = "/auth/login";
        const { data } = await api.post(url, formData);
        sessionStorage.setItem("AUTH_TOKEN", data.data.token);
        return data;
    } catch (error) {
        console.log(error);
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
};
