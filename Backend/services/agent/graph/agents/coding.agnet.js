import { getLLMModel } from "../../config/llmModel.js";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export const codingAgent = async (state) => {
    const intentLlm = await getLLMModel("intent")
    const llm = await getLLMModel("coding")
    const intentRes = await intentLlm.invoke(`
        You are an intent classifier.

        Return ONLY one of these values.
        
        CODE_GENERATION
        CODE_REVIEWS
        CODE_EXPLAINATION
        DEBUGGING
        OPTIMIZATION
        CONVERSION
        DOCUMENTATION   

        user Request:
        ${state.prompt}

        Return ONLY one of the above values based on the user request.
    `);

    const intent = intentRes.content
    if (intent === "CODE_GENERATION") {
        const prompt = `
        You are a FridayAI Coding Agent.

        Generate the requested project.

        Default Stack:
        -HTML
        -CSS
        -JAVASCRIPT

        User React / Nextjs / Vue Only if explicitly requested.

        Rules:
        - Responsive
        - Modern UI
        - CSS Variables
        - Flexbox/Grid
        - Smooth Scroll
        - Hover Effects
        - Beautiful Spacing
        - Single page unless user asks otherwise.

        IMAGES
        ========================
        Always use real unplash images.
        Never use placeholder.
        

        Return ONLY valid JSON.

        Schema:

        {
        "files":[
        {
        "name":"index.html",
        "content:"..."
        },

        {
        "name":"style.css",
        "content":"...",
        },

    {
    "name":"scipt.js",
    "content":"..."    
    }

        ]
        }

        Rules:
        - Output must start with {
        - Output must end with }
        -No markdown
        - No extra text
        - NO \`\`\`
        - Never mention intent

        user request:
        ${state.prompt}
        `
        const response = await llm.invoke(prompt);
        const data = JSON.parse(response.content);

        return {
            ...state,
            aiResponse: "Code generated successfully",
            artifacts: [
                {
                    id: Date.now(),
                    type: "Project",
                    files: data.files || [],
                    title: state.prompt
                }
            ]
        };
    }

    const response = await llm.invoke(
        `
        The user's request is:
        ${intent}
        Return Markdown only.
        Never generate projects files.

        use heading like:
        #overview

        ##Explaination
        ##Problems
        ##Improvements
        ##Best Practise
        ##Optimized code(if needed)

        user prompt:
        ${state.prompt}
        `
    )

    const data = response.content
    return {
        ...state,
        aiResponse: data,
        artifacts: []
    }
}