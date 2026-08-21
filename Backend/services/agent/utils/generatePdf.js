import PDFDocument from "pdfkit"

export const generatePdf = (data) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            margin: 50,
            info: {
                Author: "FridayAI",
                Title: data.title,
                Creator: "FridayAI",

            }
        })

        const chunks = []
        doc.on("data", (chunk) => chunks.push(chunk))
        doc.on("end", () => resolve(Buffer.concat(chunks)))
        doc.on("error", (error) => reject(error))
    })
}