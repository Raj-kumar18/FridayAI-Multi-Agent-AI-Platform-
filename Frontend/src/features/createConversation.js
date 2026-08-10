import api from "../../utils/axios"

export const createConversation = async () => {
    try {
        const { data } = await api.get("/api/chat/createConversation");
        return data;
    } catch (error) {
        console.error("Create conversation error:", error);
        throw error;
    }
};