import axios from "axios";
import dotenv from "dotenv"
dotenv.config()
export const getMessages = async (conversationId) => {
    try {
        const { data } = await axios.get(`${process.env.CHAT_SERVICE_URL}/getMessage/${conversationId}`)
        console.log("from get message", data.data)
        return data.data
    } catch (error) {
        console.log(error)
        return []
    }
}