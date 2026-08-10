import api from "../../utils/axios"

const getMessage = async (id) => {
    try {
        const { data } = await api.get(`/api/chat/getMessage/${id}`)
        console.log("dataget message", data.data)
        return data

    } catch (error) {
        console.log(error)
        return null
    }
}
export default getMessage