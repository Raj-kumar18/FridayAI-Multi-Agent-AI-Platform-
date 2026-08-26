import { getLLMModel } from "../config/llmModel.js"

export const router = async (state) => {

    if (state.agent && state.agent !== "auto") {
        return {
            ...state,
            agent: state.agent
        }
    }

    if (state.file) {
        if (state.file.mimetype === "application/pdf") {
            return {
                ...state,
                agent: "pdfRag"
            }
        }

        if (state.file.mimetype.startsWith("image/")) {
            return {
                ...state,
                agent: "imageAnalyzer"
            }
        }
    }



    const llm = await getLLMModel("router")
    const prompt = `You are an agent router
    Available agents:
    - chat
    - search
    - pdf
    - ppt
    - coding
    - vision
    - calendar


    Rules:

    chat:
    General Conversation,
    explainantions,
    learning,
    questions,
    brainstorming.

    search:
    current Events,
    recent events,
    weather,
    stocks,
    data-driven questions,
    latest lookups.

    coding:
    writing code,
    debugging,
    code explanation,
    code optimization,
    tech stack questions,
    code generation,
    architecture,
    API design

    pdf:
    Documents,
    Research papers,
    Technical manuals,
    Reports,
    Books,
    Summarization,
    Information extraction,
    Q&A,
    Content analysis.

    ppt:
    Presentations,
    Slideshows,
    Business decks,
    Educational content,
    Speech outlines,
    Content generation,
    Slide design,
    Structure suggestions,

    vision:
    Generate Images,
    Image understanding,
    Visual analysis,
    Object recognition,
    Scene description,
    Visual Q&A,
    Image interpretation.

    calendar:
    Add events,
    Delete events,
    Update events,
    List events,
    Check availability,
    Calendar management.

    Return only one word:
    chat
    search
    pdf
    ppt
    coding
    vision
    calendar

    User Query:
    ${state.prompt}
    
    `
    const result = await llm.invoke(prompt)
    console.log(result)
    return {
        ...state,
        agent: result.content.trim().toLowerCase()
    }
}