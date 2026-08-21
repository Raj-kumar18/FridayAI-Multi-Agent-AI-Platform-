import { getLLMModel } from "../../config/llmModel.js";
import { generatePdf } from "../../utils/generatePdf.js";
import { getFromS3 } from "../../utils/getFromS3.js";
import { uploadToS3 } from "../../utils/uploadToS3.js";

export const pdfAgent = async (state) => {
    try {
        const llm = await getLLMModel("pdf");

        const prompt = `
You are an expert document writer and content architect.

Create a professional, well-structured document based on the user's topic.

IMPORTANT RULES:

1. Return ONLY valid JSON.
2. Do NOT return Markdown.
3. Do NOT wrap the JSON inside \`\`\`json.
4. Do NOT add explanations before or after the JSON.
5. Do NOT include any extra keys.
6. All content must be clear, accurate, professional and relevant.
7. Avoid unnecessary repetition.
8. Use concise but informative language.

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
- Each section must have 3-6 concise bullet points.
- Each section must cover a distinct aspect of the topic.
- Maintain a logical flow.
- Start with fundamental concepts.
- Progress toward practical or advanced concepts.
- Do not create empty sections.
- Do not create empty bullet points.
- Do not use Markdown.
- Do not include citations unless explicitly requested.

USER TOPIC:

${state.prompt}
`;

        // ============================================
        // Generate document content
        // ============================================

        const response = await llm.invoke(prompt);

        let content = response?.content;

        if (!content) {
            throw new Error("LLM returned empty response");
        }

        // ============================================
        // Clean accidental markdown fences
        // ============================================

        content = content
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        // ============================================
        // Parse JSON
        // ============================================

        const data = JSON.parse(content);

        // ============================================
        // Basic validation
        // ============================================

        if (
            !data.title ||
            !data.subtitle ||
            !Array.isArray(data.sections)
        ) {
            throw new Error("Invalid document structure");
        }

        // ============================================
        // Generate PDF
        // ============================================

        const pdfBuffer = await generatePdf(data);

        if (!pdfBuffer) {
            throw new Error("PDF generation failed");
        }

        // ============================================
        // Upload to S3
        // ============================================

        const filename = `pdf-${Date.now()}.pdf`;

        await uploadToS3(
            filename,
            pdfBuffer,
            "application/pdf"
        );

        // ============================================
        // Signed URL
        // ============================================

        // 24 hours
        const expiresIn = 24 * 60 * 60;

        const downloadUrl = await getFromS3(
            filename,
            expiresIn
        );

        // ============================================
        // Return
        // ============================================

        return {
            ...state,

            aiResponse: `
PDF Generated Successfully!

**${data.title}**

[Download PDF](${downloadUrl})

This link will remain active for 24 hours.
`.trim(),

            pdf: {
                filename,
                title: data.title,
                url: downloadUrl,
                expiresIn
            }
        };

    } catch (error) {

        console.error("========== PDF AGENT ERROR ==========");
        console.error(error);
        console.error("====================================");

        return {
            ...state,
            aiResponse: "Something went wrong while generating the PDF."
        };
    }
};