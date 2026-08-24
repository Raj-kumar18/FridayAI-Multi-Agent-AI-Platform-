import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getLLMModel } from "../../config/llmModel.js"
import { getMemory } from "../../config/memory.js"
import { deductCredits } from "../../utils/deductCredits.js"

export const chatAgent = async (states) => {

    try {

        const llm = await getLLMModel("chat")
        const history = await getMemory(states.conversationId)

        const searchContext = states.searchResults ? `
    Web Search Results:
    ${JSON.stringify(states.searchResults)}

    Answer the user using only the above search results

    `: ""


        const prompt = `
    You are a FridayAI, an Intelligent AI assistant.

    ${searchContext}

    if searchContext exists:
    - Use search results to answe.
    - Do not mention internal tools.

    Rules:
    - For simple questions ,greeting ,and short queries , respond naturally in plain text.
    -For technical ,education,coding,or detailed topics ,use clean Markdown.

    Formatting:
    - use # for titles and ## for section.
    - leave a blank line after heading.
    - use bullet point for lists.
    - use numbered lists for steps.
    - use fenced code blocks with language tags for code.
    - keep paragraph shot and readlable.
    - Never write headining and content on the smae line.
    - Never generate a large wall of text
    
    `



        const messages = [
            new SystemMessage(prompt)
        ]
        history.forEach((msg) => {
            if (!msg.content) return;

            if (msg.role === "user") {
                messages.push(new HumanMessage(msg.content));
            }

            if (msg.role === "assistant") {
                messages.push(new AIMessage(msg.content));
            }
        });

        messages.push(new HumanMessage(states.prompt))

        const response = await llm.invoke(messages)
        await deductCredits(states.userId, "chat")
        return {
            ...states,
            aiResponse: response.content,
        }
    } catch (error) {
        console.log(error)
        return {
            ...states,
            aiResponse: "something went wrong. Please try again",
        }
    }
}