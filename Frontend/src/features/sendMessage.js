import api from "../../utils/axios"

const sendMessage = async (payload) => {
    try {
        const { data } = await api.post("/api/agent/chat", payload)
        console.log("dataget message", data)
        return data

    } catch (error) {
        console.log(error)
        return null
    }
}
export default sendMessage