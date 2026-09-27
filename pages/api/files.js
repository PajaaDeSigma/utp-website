import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "files.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function readMeta() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeMeta(list) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ files: readMeta() });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const meta = readMeta();
    const target = meta.find((f) => f.id === id);
    if (!target) return res.status(404).json({ error: "File tidak ditemukan." });

    const filePath = path.join(UPLOAD_DIR, target.id);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {}

    writeMeta(meta.filter((f) => f.id !== id));
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "DELETE"]);
  return res.status(405).json({ error: "Metode tidak diizinkan" });
}
