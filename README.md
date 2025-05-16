
````markdown
<p align="center">
  <img src="https://fonts.gstatic.com/s/atomicage/v7/xMQKu8qZ1UZR-NjT4z0utw.woff2" alt="Atomic Age font" style="display:none;" />
</p>

<div align="center">
  <h1>📑 Extractify</h1>
  <p>PDF Page Extractor Application</p>
  <a href="https://extractify-91.vercel.app">
    <img src="https://img.shields.io/badge/Frontend-Live-blue.svg" alt="Frontend Live">
  </a>
  <a href="https://extractify-server.vercel.app">
    <img src="https://img.shields.io/badge/API-Live-green.svg" alt="API Live">
  </a>
</div>

---

## 🔗 Live Demo

- **Frontend:** [https://extractify-91.vercel.app](https://extractify-91.vercel.app)  
- **Backend API:** [https://extractify-server.vercel.app](https://extractify-server.vercel.app)

---

## 🧐 Overview

- Upload secure PDFs  
- View all pages of an uploaded PDF  
- Select and reorder pages before extraction  
- Download a newly generated PDF  
- Delete unwanted PDFs  
- Authenticated user management for document storage  

---

## 🚀 Quick Start

```bash
git clone https://github.com/Roshanbtech/Extractify.git
cd Extractify
````

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

*Open your browser at `http://localhost:5173`*

---

## 🏗 Architecture & Tech Stack

**Frontend:** React · Vite · TypeScript · Zustand · TailwindCSS
**Backend:** Express · TypeScript · MongoDB (Mongoose)
**Storage:** Cloudinary (authenticated)
**PDF Processing:** pdf-lib
**Auth:** JWT · bcrypt
**Security & Logging:** Morgan · Helmet · CORS
**Architecture:** Clean / Hexagonal (Domain → Use Cases → Adapters)

---

## 🔌 API Endpoints

### Authentication

* `POST /api/auth/register` – User registration
* `POST /api/auth/login` – Returns JWT
* `POST /api/auth/logout` – Clears user session

### PDF Operations

* `POST /api/pdf/upload` – Upload a PDF (`multipart/form-data`, key `pdf`)
* `GET  /api/pdf` – List all PDFs for user
* `GET  /api/pdf/access/:publicId` – Get signed URL
* `POST /api/pdf/extract` – Extract & create new PDF

> **Auth:** Send `Authorization: Bearer <token>` header or cookie `accessToken`

---

## 📸 Screenshots

| Signup                                | Login                                        |
| ------------------------------------- | -------------------------------------------- |
| ![Signup](./screenshots/signup.jpg)   | ![Login](./screenshots/login.jpg)            |
| Home                                  | Upload                                       |
| ![Home](./screenshots/home.jpg)       | ![Upload](./screenshots/upload.jpg)          |
| Preview                               | Page Select                                  |
| ![Preview](./screenshots/preview.jpg) | ![Page Select](./screenshots/pageselect.jpg) |
| Extraction Result                     | Uploads                                      |
| ![Extract](./screenshots/extract.jpg) | ![Uploads](./screenshots/uploads.jpg)        |

---

## 🧪 Testing

1. **Login** to get JWT
2. **Upload** a PDF (`multipart/form-data`, key `pdf`)
3. **Extract pages** by POSTing JSON to `/api/pdf/extract`:

```json
{
  "publicId": "pdfs/USER_ID/original/my.pdf",
  "pages": [1, 3, 5],
  "order": [2, 1, 3]
}
```

---

## 📄 License

MIT • [Roshanbtech](https://github.com/Roshanbtech)

```

---
  

```
