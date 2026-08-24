import searhTool from "../../config/tavily.js"
import { deductCredits } from "../../utils/deductCredits.js";

export const searchAgent = async (state) => {

    try {

        const results = await searhTool.invoke({
            query: state.prompt
        })

        console.log("Search results:", results);
        await deductCredits(state.userId, "search")
        return { ...state, searchResults: results, images: results.images }
    } catch (error) {
        console.error("Search agent error:", error);
        return { ...state, searchResults: null, images: null }
    }

}