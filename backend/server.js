import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: path.join(__dirname, 'uploads') });

const dataFile = path.join(__dirname, 'data.json');
let photos = [];
if (fs.existsSync(dataFile)) {
  try {
    photos = JSON.parse(fs.readFileSync(dataFile));
  } catch {
    photos = [];
  }
}

app.get('/api/photos', (req, res) => {
  res.json(photos);
});

app.post('/api/photos', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Photo is required' });
  }
  const photo = {
    id: Date.now(),
    filename: req.file.filename,
    originalName: req.file.originalname
  };
  photos.push(photo);
  fs.writeFileSync(dataFile, JSON.stringify(photos));
  res.status(201).json(photo);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
