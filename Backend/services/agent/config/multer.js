import path from "path"
import fs from "fs"
import multer from "multer"


const uploadDir = path.resolve("./temp")

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir)
    },
    filename(req, file, cb) {
        const fileExtension = path.extname(file.originalname)
        const fileName = `${Date.now()}-${fileExtension}`
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "application/pdf" || file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Only PDF and Images are allowed"), false)
    }
}


const upload = multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } })

export default upload