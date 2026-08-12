import { TavilySearch } from "@langchain/tavily"
// import dotenv from "dotenv"
// dotenv.config()

const searhTool = new TavilySearch({
    maxResult: 5,
    topic: "general",
    includeImages: true,

})

export default searhTool