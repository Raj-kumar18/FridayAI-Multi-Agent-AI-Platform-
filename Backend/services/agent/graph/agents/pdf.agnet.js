import { getLLMModel } from "../../config/llmModel.js"

export const pdfAgent = async (state) => {

    try {
        const llm = await getLLMModel("pdf")

        const prompt = `
You are an expert document writer and content architect.

Your task is to generate a well-structured document based on the user's topic.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT return Markdown.
3. Do NOT wrap the JSON inside \`\`\`json.
4. Do NOT add explanations before or after the JSON.
5. Do NOT include any extra keys outside the specified structure.
6. All content must be clear, accurate, professional, and relevant to the topic.
7. Avoid unnecessary repetition.
8. Use concise but informative language.
9. Generate content suitable for a professional document.

OUTPUT STRUCTURE:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}

CONTENT REQUIREMENTS:

- Generate 4-8 sections.
- Each section must have a meaningful heading.
- Each section must contain 3-6 concise bullet points.
- The title should clearly represent the overall topic.
- The subtitle should briefly explain the purpose or context of the document.
- Each bullet point should contain useful information rather than generic statements.
- Maintain a logical flow between sections.
- Start with fundamental concepts and gradually move toward advanced or practical information where appropriate.
- Do not create empty sections.
- Do not create empty bullet points.
- Do not use Markdown syntax such as *, -, #, or backticks inside the content.
- Do not include citations unless explicitly requested by the user.

USER TOPIC:

${state.prompt}
`;

        const response = await llm.invoke(prompt)
        const content = JSON.parse(response?.content)
        console.log(content)
    } catch (error) {
        console.log(error)
    }

}