import api from "../../utils/axios"

export const verifyPayment = async (payload) => {
    try {
        const { data } = await api.post("/api/billing/verify-payment", payload);
        console.log(data)
        return data;
    } catch (error) {
        console.error("verify payment error:", error);
        return []
    }
};