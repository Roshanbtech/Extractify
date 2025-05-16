<div align="center">
  <h1>📑 <strong>Extractify</strong></h1>
  <p>PDF Page Extractor Application</p>
  <a href="https://extractify-91.vercel.app">
    ![Frontend Live](https://img.shields.io/badge/Frontend-Live-blue?style=flat-square&logo=file-pdf)
  </a>
  <a href="https://extractify-server.vercel.app">
    ![API Live](https://img.shields.io/badge/API-Live-green?style=flat-square&logo=file-pdf)
  </a>
</div>

---

 🔗 Live Demo

* Frontend: [https://extractify-91.vercel.app](https://extractify-91.vercel.app)
* Backend API: [https://extractify-server.vercel.app](https://extractify-server.vercel.app)

---

 🎯 Overview

Extractify lets authenticated users:

1. Upload secure PDFs
2. View a gallery of uploaded documents
3. Select & extract specific pages (supports reordering)
4. Download a newly generated PDF
5. Delete unwanted PDF

Built with a clean, SOLID‑driven architecture for maintainability and scalability.

---

 🔧 Quick Start

1. Clone

   ```bash

git clone [https://github.com/Roshanbtech/Extractify.git](https://github.com/Roshanbtech/Extractify.git)
cd Extractify

````
2. Backend

   ```bash
cd backend
cp .env.example .env
# fill your MONGO_URL, JWT_SECRET, CLOUDINARY_* values
npm install
npm run dev
````

3. Frontend

   ```bash

cd ../frontend
npm install
npm run dev

````

Access the app on `http://localhost:5173`.

---

 ⚙️ Architecture & Tech
- Frontend: React + Vite + TypeScript + Zustand + TailwindCSS
- Backend: Express + TypeScript + MongoDB (Mongoose)
- Storage: Cloudinary (raw, authenticated)
- PDF Processing: pdf-lib
- Auth: JWT & bcrypt
- Logging & Security: Morgan, Helmet, CORS
- Pattern: Clean/Hexagonal (Domain → Use Cases → Adapters)

---

 📡 API Endpoints
All routes prefixed with `/api`

### Auth
- `POST /auth/register` → Sign up new user
- `POST /auth/login` → Get JWT
- `POST /auth/logout` → Clear session

### PDFs
- `POST /pdf/upload` → **multipart/form-data** body field `pdf`
- `GET  /pdf` → List current user’s documents
- `GET  /pdf/access/:publicId` → Returns signed URL
- `POST /pdf/extract` → JSON `{ publicId, pages: number[], order?: number[] }`

Authorization: send `Authorization: Bearer <token>` header or cookie `accessToken`.

---

 🛠️ Testing
Use Insomnia or Postman:
1. Login to retrieve JWT
2. Upload a PDF (`multipart/form-data`, key `pdf`)
3. List, access, and extract via corresponding endpoints

Example extract body:
```json
{
  "publicId": "pdfs/USER_ID/original/my.pdf",
  "pages": [1,3,5],
  "order": [2,1,3]
}
````

---

 🖼️ Adding Images

   ```md
   ![Upload Page](./screenshots/upload.png)
   ![Page Selection](./screenshots/select.png)
   ![Extraction Result](./screenshots/result.png)
   ```
---

📜 License

MIT • [Roshan](https://github.com/Roshanbtech)
