import api from "../../utils/axios"

export const createOrder = async (payload) => {
    try {
        const { data } = await api.post("/api/billing/create-order", payload);
        console.log(data)
        return data;
    } catch (error) {
        console.error("Create order error:", error);
        return []
    }
};