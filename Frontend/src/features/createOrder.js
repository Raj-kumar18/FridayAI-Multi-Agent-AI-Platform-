import api from "../../utils/axios"

export const createOrder = async (plan) => {
    try {
        const { data } = await api.post("/api/billing/create-order", { plan });
        console.log(data)
        return data;
    } catch (error) {
        console.error("Create order error:", error);
        return []
    }
};