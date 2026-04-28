import api from "./api";
import { saveToken } from "../utils/auth";

export const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password
    });

    const token = response.data.token;

    saveToken(token);

    return response.data;
};

export const register = async (username, email, password) => {
    const response = await api.post("/auth/register", {
        username,
        email,
        password
    });

    return response.data;
};