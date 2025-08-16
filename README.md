
# Portafolio Camila García

Este repositorio ahora incluye una base para un proyecto **full‑stack** con el frontend y el backend separados en carpetas distintas.

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

## Frontend (Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

La carpeta `frontend` contiene el portafolio estático con Tailwind integrado; las solicitudes al backend se realizan vía `/api`.
=======

