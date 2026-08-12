import api from "../../utils/axios.js"

export const updateConversation = async (payload) => {
    try {
        const { data } = await api.put(
            `/api/chat/updateConversation/${payload.id}`,
            {
                title: payload.title
            }
        );

        return data;
    } catch (error) {
        console.error(
            "Update conversation error:",
            error.response?.data || error
        );
    }
};