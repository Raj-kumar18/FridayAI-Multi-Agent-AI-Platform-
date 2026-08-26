import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { pdfAgent } from "./agents/pdf.agnet.js";
import { pptAgent } from "./agents/ppt.agnet.js";
import { codingAgent } from "./agents/coding.agnet.js";
import { chatAgent } from "./agents/chat.agnet.js";
import { visionAgent } from "./agents/visions.agnet.js";
import { searchAgent } from "./agents/search.agnet.js";
import { pdfRag } from "./agents/pdfRag.agent.js";
import { imageAnalyzer } from "./agents/imageAnalyzer.agent.js";
import { calendarAgent } from "./agents/calendar.agent.js";


const workFlow = new StateGraph(agentState)
workFlow.addNode("router", router)
workFlow.addNode("chatAgent", chatAgent)
workFlow.addNode("searchAgent", searchAgent)
workFlow.addNode("pdfAgent", pdfAgent)
workFlow.addNode("pptAgent", pptAgent)
workFlow.addNode("codingAgent", codingAgent)
workFlow.addNode("visionAgent", visionAgent)
workFlow.addNode("pdfRag", pdfRag)
workFlow.addNode("imageAnalyzer", imageAnalyzer)
workFlow.addNode("calendarAgent", calendarAgent)

workFlow.addEdge("__start__", "router")
workFlow.addConditionalEdges("router", (state) => {
    switch (state.agent) {
        case "chat":
            return "chatAgent"
        case "search":
            return "searchAgent"
        case "pdf":
            return "pdfAgent"
        case "ppt":
            return "pptAgent"
        case "coding":
            return "codingAgent"
        case "vision":
            return "visionAgent"
        case "pdfRag":
            return "pdfRag"
        case "imageAnalyzer":
            return "imageAnalyzer"
        case "calendar":
            return "calendarAgent"
        default:
            return "chatAgent"
    }
}, {
    chatAgent: "chatAgent",
    searchAgent: "searchAgent",
    pdfAgent: "pdfAgent",
    pptAgent: "pptAgent",
    codingAgent: "codingAgent",
    visionAgent: "visionAgent",
    pdfRag: "pdfRag",
    imageAnalyzer: "imageAnalyzer",
    calendarAgent: "calendarAgent"
})

workFlow.addEdge("searchAgent", "chatAgent")
workFlow.addEdge("chatAgent", "__end__")
workFlow.addEdge("pdfAgent", "__end__")
workFlow.addEdge("pptAgent", "__end__")
workFlow.addEdge("codingAgent", "__end__")
workFlow.addEdge("visionAgent", "__end__")
workFlow.addEdge("imageAnalyzer", "__end__")
workFlow.addEdge("pdfRag", "__end__")
workFlow.addEdge("calendarAgent", "__end__")

export const graph = workFlow.compile()

// export const AgentFlow = workflow.compile()