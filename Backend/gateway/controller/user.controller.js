
const getCurrentUser = async (req, res) => {
    try {
        const user = await req.user
        return res.json({
            success: true,
            message: "User fetched successfully",
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export default getCurrentUser