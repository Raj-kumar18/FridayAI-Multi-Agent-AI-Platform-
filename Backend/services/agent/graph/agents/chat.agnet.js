import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getLLMModel } from "../../config/llmModel.js"
import { getMemory } from "../../config/memory.js"

export const chatAgent = async (states) => {
    const llm = await getLLMModel("chat")
    const history = await getMemory(states.conversationId)
    console.log(history)


    const prompt = `
    You are a FridayAI, an Intelligent AI assistant.

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
    history.forEach(msg => {
        if (msg.role === "user") {
            messages.push(new HumanMessage(msg.content))
        }
        if (msg.role === "assistant") {
            messages.push(new AIMessage(msg.content))
        }
    })

    messages.push(new HumanMessage(states.prompt))

    const response = await llm.invoke(messages)

    return {
        ...states,
        aiResponse: response.content,
    }
}