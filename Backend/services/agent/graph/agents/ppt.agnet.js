import { getLLMModel } from "../../config/llmModel.js";
import { generatePpt } from "../../utils/generatePpt.js";
import { getFromS3 } from "../../utils/getFromS3.js";
import { uploadToS3 } from "../../utils/uploadToS3.js";

export const pptAgent = async (state) => {
    try {

        // ============================================
        // GET LLM
        // ============================================

        const llm = await getLLMModel("ppt");


        // ============================================
        // PROMPT
        // ============================================

        const prompt = `
You are a professional presentation designer, content strategist, and visual storytelling expert.

Your task is to create a clear, engaging, and professionally structured presentation based on the user's topic.

IMPORTANT OUTPUT RULES:

1. Return ONLY valid JSON.
2. Do NOT return Markdown.
3. Do NOT wrap the JSON inside \`\`\`json.
4. Do NOT add explanations before or after the JSON.
5. Do NOT include any extra keys outside the specified JSON structure.
6. Do NOT use Markdown syntax inside the content.
7. Keep the content concise, informative, and presentation-friendly.
8. Avoid repetition and generic filler statements.
9. Every slide must contribute meaningful information.
10. Maintain a logical storytelling flow from introduction to conclusion.

OUTPUT FORMAT:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": [
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

CONTENT RULES:

- Generate exactly 6 content slides.
- Each slide must contain 4-6 concise bullet points.
- The first slide should introduce the topic and establish context.
- The second slide should explain the fundamental concepts or background.
- The middle slides should explain important concepts, mechanisms, features, examples, or practical applications.
- The final slide should summarize the key takeaways, conclusions, or future perspective.
- Each slide must have a meaningful and descriptive title.
- Each bullet point should communicate one clear idea.
- Keep bullet points short enough to fit naturally on a presentation slide.
- Prefer specific information over vague statements.
- Use simple and professional language.
- Avoid paragraphs.
- Avoid unnecessary technical language unless the topic requires it.
- Do not repeat the same information across multiple slides.
- Ensure the slides follow a natural progression.
- Do not create empty titles or bullet points.
- Do not include citations unless explicitly requested.
- Do not include speaker notes.
- Do not include image URLs.
- Do not include code blocks.

SLIDE STRUCTURE:

Slide 1:
- Topic introduction
- Context
- Why the topic matters
- Key objective

Slide 2:
- Fundamental concepts
- Background
- Important terminology
- Core principles

Slide 3:
- Main concepts or components
- How they work
- Important characteristics
- Key details

Slide 4:
- Practical applications
- Examples
- Benefits
- Real-world usage

Slide 5:
- Challenges
- Limitations
- Common problems
- Possible solutions

Slide 6:
- Key takeaways
- Important conclusions
- Future perspective
- Final summary

QUALITY REQUIREMENTS:

- Make the presentation useful for someone learning the topic for the first time.
- Maintain consistent terminology throughout all slides.
- Prioritize the most important information.
- Make each slide understandable without requiring the previous slide.
- Use factual and topic-relevant information.
- Do not invent statistics, studies, quotes, or specific claims unless well-established or provided by the user.

USER TOPIC:

${state.prompt}
`;


        // ============================================
        // LLM RESPONSE
        // ============================================

        const response = await llm.invoke(prompt);

        // LangChain ChatModel -> response.content
        const rawContent = response?.content;

        if (!rawContent) {
            throw new Error("LLM returned empty response");
        }


        // ============================================
        // PARSE JSON
        // ============================================

        let data;

        try {

            data = JSON.parse(rawContent);

        } catch (error) {

            console.error(
                "Invalid JSON returned by LLM:",
                rawContent
            );

            throw new Error(
                "LLM returned invalid presentation JSON"
            );
        }


        // ============================================
        // VALIDATE DATA
        // ============================================

        if (
            !data.title ||
            !Array.isArray(data.slides) ||
            data.slides.length !== 6
        ) {
            throw new Error(
                "Invalid presentation structure"
            );
        }


        // ============================================
        // GENERATE PPT
        // ============================================

        const ppt = await generatePpt(data);

        if (!ppt) {
            throw new Error(
                "PPT generation failed"
            );
        }


        // ============================================
        // CONVERT PPT TO BUFFER
        // ============================================

        const buffer = await ppt.write({
            outputType: "nodeBuffer"
        });


        // ============================================
        // UPLOAD TO S3
        // ============================================

        const filename =
            `presentation-${Date.now()}.pptx`;

        const contentType =
            "application/vnd.openxmlformats-officedocument.presentationml.presentation";

        await uploadToS3(
            filename,
            buffer,
            contentType
        );


        // ============================================
        // SIGNED DOWNLOAD URL
        // ============================================

        // 24 hours
        const expiresIn = 24 * 60 * 60;

        const downloadUrl =
            await getFromS3(
                filename,
                expiresIn
            );


        console.log(
            "PPT uploaded successfully:",
            filename
        );


        // ============================================
        // RETURN
        // ============================================

        return {
            ...state,

            aiResponse: `
**Presentation Generated Successfully!**

**${data.title}**

[Download PPT](${downloadUrl})

Link expires in 24 hours.
`
        };

    } catch (error) {

        console.error(
            "========== PPT AGENT ERROR =========="
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Stack:",
            error.stack
        );

        return {
            ...state,
            aiResponse:
                "Failed to generate PPT. Please try again."
        };
    }
};