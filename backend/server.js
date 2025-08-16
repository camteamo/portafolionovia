import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: path.join(__dirname, 'uploads') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL
    )
  `);
}

init().catch(err => {
  console.error('Database initialization failed', err);
});

app.get('/api/photos', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, filename, original_name AS "originalName" FROM photos ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

app.post('/api/photos', upload.single('photo'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Photo is required' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO photos(filename, original_name) VALUES($1, $2) RETURNING id, filename, original_name',
      [req.file.filename, req.file.originalname]
    );
    const photo = {
      id: rows[0].id,
      filename: rows[0].filename,
      originalName: rows[0].original_name
    };
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save photo' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
