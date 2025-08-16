# Portafolio Camila García

Este repositorio ahora incluye una base para un proyecto **full‑stack**.

## Backend (Node + Express)

```bash
cd backend
npm install
npm run dev
```

Endpoints disponibles:
- `GET /api/photos` – lista las fotos cargadas.
- `POST /api/photos` – carga una nueva foto (campo `photo`).

Los archivos subidos se guardan en `backend/uploads`.

## Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

La aplicación de React se comunica con el backend a través de `/api`.

## Sitio estático

El archivo `index.html` original se mantiene como referencia del prototipo inicial.
