import axios from "axios";
import { getLLMModel } from "../../config/llmModel.js";
import { uploadToS3 } from "../../utils/uploadToS3.js";
import { getFromS3 } from "../../utils/getFromS3.js";

export const visionAgent = async (state) => {
    try {
        const llm = await getLLMModel("image");

        const response = await llm.invoke(`
You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:
- Professional composition
- Cinematic lighting
- Ultra realistic
- High details
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}
`);

        const prompt = response.content.trim();

        const imageUrl =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

        const imageRes = await axios.get(imageUrl, {
            responseType: "arraybuffer",
        });

        // ============================================
        // GET ACTUAL IMAGE CONTENT TYPE
        // ============================================

        const contentType =
            imageRes.headers["content-type"] || "image/png";

        console.log("IMAGE CONTENT TYPE:", contentType);
        console.log("IMAGE SIZE:", imageRes.data.byteLength);

        // ============================================
        // GET CORRECT FILE EXTENSION
        // ============================================

        let extension = "png";

        if (contentType.includes("jpeg")) {
            extension = "jpg";
        } else if (contentType.includes("webp")) {
            extension = "webp";
        } else if (contentType.includes("gif")) {
            extension = "gif";
        }

        const filename = `image-${Date.now()}.${extension}`;

        const buffer = Buffer.from(imageRes.data);

        // ============================================
        // UPLOAD TO S3
        // ============================================

        await uploadToS3(
            filename,
            buffer,
            contentType
        );

        // ============================================
        // PRESIGNED URL
        // 24 HOURS
        // ============================================

        const expiresIn = 24 * 60 * 60;

        const downloadUrl = await getFromS3(
            filename,
            expiresIn
        );

        console.log("S3 URL:", downloadUrl);

        // ============================================
        // RESPONSE
        // ============================================

        return {
            ...state,

            aiResponse: `
![Generated Image](${downloadUrl})

[Download Image](${downloadUrl})

Link expires in 24 hours.
`.trim(),
        };

    } catch (error) {
        console.error("VISION AGENT ERROR:", error);

        return {
            ...state,
            aiResponse: "Failed to generate image",
        };
    }
};