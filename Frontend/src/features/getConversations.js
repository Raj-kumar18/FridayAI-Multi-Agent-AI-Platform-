import api from "../../utils/axios"

export const getConversations = async () => {
    try {
        const { data } = await api.get("/api/chat/getConversation");
        return data;
    } catch (error) {
        console.error("Get conversations error:", error);
        throw error;
    }
};