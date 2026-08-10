import { getLLMModel } from "../../config/llmModel.js"

export const chatAgent = async (states) => {
    const llm = await getLLMModel("chat")

    const prompt = `
    You are a FridayAI, an Intelligent AI assistant.
    
    `

    const response = await llm.invoke([
        {
            "role": "system",
            "content": prompt
        },
        {
            "role": "human",
            "content": states.prompt
        }
    ])
    return {
        ...states,
        aiResponse: response.content,
    }
}