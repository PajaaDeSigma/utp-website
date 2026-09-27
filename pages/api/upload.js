import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const DATA_FILE = path.join(process.cwd(), "data", "files.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

const ALLOWED_EXT = [".ppt", ".pptx", ".mp4", ".mov", ".mkv", ".webm"];
const MAX_SIZE = 300 * 1024 * 1024; // 300MB

function readMeta() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeMeta(list) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const form = formidable({
    multiples: false,
    maxFileSize: MAX_SIZE,
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Gagal mengunggah file. Pastikan ukuran file di bawah 300MB." });
    }

    const file = files.file?.[0] || files.file;
    if (!file) {
      return res.status(400).json({ error: "Tidak ada file yang dikirim." });
    }

    const originalName = file.originalFilename || "berkas";
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXT.includes(ext)) {
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ error: "Tipe file tidak didukung. Gunakan PPT/PPTX atau MP4/MOV/MKV/WEBM." });
    }

    const category = fields.category?.[0] || fields.category || (ext.includes("pp") ? "ppt" : "video");
    const finalName = path.basename(file.filepath);

    const meta = readMeta();
    const entry = {
      id: finalName,
      name: originalName,
      category,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: `/uploads/${finalName}`,
    };
    meta.unshift(entry);
    writeMeta(meta);

    return res.status(200).json({ success: true, file: entry });
  });
}
