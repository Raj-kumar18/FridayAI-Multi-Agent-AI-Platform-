import { getLLMModel } from "../../config/llmModel.js";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export const codingAgent = async (state) => {
    console.log("hello from coding agent");

    const llm = await getLLMModel("coding");

    const prompt = `You are FridayAI, an expert programming assistant.

    Rules:
    - Write clean, efficient, and well-commented code.
    - Always use Markdown code blocks with the correct language identifier.
    - Provide explanations only after the code.
    - Suggest improvements or alternative solutions when applicable.
    
    User Query:
    ${state.prompt}`;

    const messages = [
        new SystemMessage(prompt),
        new HumanMessage(state.prompt)
    ];

    const response = await llm.invoke(messages);

    return {
        ...state,
        aiResponse: response.content
    };
}