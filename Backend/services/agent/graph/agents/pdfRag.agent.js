import fs from "fs";
import pdf from "pdf-parse";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { vectorStore } from "../../config/vectorDB.js";
import { getLLMModel } from "../../config/llmModel.js";
import { checkAgentLimit } from "../../config/agentLimit.js";

export const pdfRag = async (state) => {
    await checkAgentLimit(state.userId, "pdf")
    let filePath = null;

    try {
        if (!state?.file?.path) {
            throw new Error("PDF file path not found");
        }

        filePath = state.file.path;

        const buffer = fs.readFileSync(filePath);

        if (!buffer.length) {
            throw new Error("PDF file is empty");
        }

        // ============================================
        // PDF TEXT EXTRACTION
        // ============================================

        const result = await pdf(buffer);

        const text = result.text?.trim();

        console.log("PDF pages:", result.numpages);
        console.log("Extracted text length:", text?.length || 0);

        // ============================================
        // IMPORTANT
        // ============================================

        if (!text) {
            console.log(
                "PDF contains no text layer. OCR is required."
            );

            return {
                ...state,
                aiResponse:
                    "This PDF appears to be scanned/image-based. Text extraction failed because the PDF does not contain a readable text layer. OCR support is required for this PDF."
            };
        }

        // ============================================
        // CHUNKING
        // ============================================

        const splitter =
            new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200
            });

        const docs =
            await splitter.createDocuments([text]);

        console.log(
            "Number of chunks:",
            docs.length
        );

        // ============================================
        // VECTOR STORE
        // ============================================

        const collectionName =
            `pdf-${Date.now()}`;

        const store = await vectorStore(
            docs,
            collectionName
        );

        // ============================================
        // SEARCH
        // ============================================

        const relevantDocs =
            await store.similaritySearch(
                state.prompt,
                5
            );

        const context =
            relevantDocs
                .map(doc => doc.pageContent)
                .join("\n\n");

        // ============================================
        // LLM
        // ============================================

        const llm =
            await getLLMModel("pdfRag");

        const messages = [

            new SystemMessage(`
You are FridayAI PDF Assistant.

You must answer the user's question ONLY
using the information present in the provided
PDF context.

Rules:

1. Never use outside knowledge.
2. Never invent information.
3. If the answer cannot be found in the context,
   say exactly:

"I couldn't find this information in the uploaded PDF."

4. Combine relevant information when necessary.
5. Keep the answer clear and concise.
6. Markdown formatting is allowed.
`),

            new HumanMessage(`
PDF CONTEXT:

${context}

USER QUESTION:

${state.prompt}
`)
        ];

        const response =
            await llm.invoke(messages);

        return {
            ...state,
            aiResponse: response.content
        };

    } catch (error) {

        console.error(
            "========== PDF RAG ERROR =========="
        );

        console.error(error);

        return {
            ...state,
            aiResponse: error?.data?.message || "Failed to Analyzed uploaded PDF. Please try again."
        };

    } finally {

        if (
            filePath &&
            fs.existsSync(filePath)
        ) {
            try {
                fs.unlinkSync(filePath);

                console.log(
                    "Temporary PDF deleted"
                );

            } catch (error) {
                console.error(
                    "Failed to delete temporary PDF:",
                    error.message
                );
            }
        }
    }
};