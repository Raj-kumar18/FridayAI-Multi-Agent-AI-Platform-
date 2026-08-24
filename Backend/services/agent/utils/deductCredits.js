import axios from "axios"
import dotenv from "dotenv"
dotenv.config()
export const deductCredits = async (userId, agent) => {
    try {
        const { data } = await axios.post(`${process.env.AUTH_SERVICE_URL}/deduct-credits`, { userId, agent })
        console.log(data)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}