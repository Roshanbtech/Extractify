Extractify  
PDF Page Extractor Application  
A full-stack app for extracting specific pages from PDFs  

Frontend Live  
[https://extractify-91.vercel.app](https://extractify-91.vercel.app)  

API Live  
[https://extractify-server.vercel.app](https://extractify-server.vercel.app)  

Live Demo  
Frontend: [https://extractify-91.vercel.app](https://extractify-91.vercel.app)  
Backend API: [https://extractify-server.vercel.app](https://extractify-server.vercel.app)  

Overview  
Extractify allows users to  
- Upload secure PDFs  
- View all pages of an uploaded PDF  
- Select and reorder pages before extraction  
- Download a newly generated PDF  
- Delete unwanted PDFs  
- Authenticated user management for document storage  

Quick Start  

Clone the Repository  
git clone https://github.com/Roshanbtech/Extractify.git  
cd Extractify  

Backend Setup  
cd backend  
cp .env.example .env  
Fill required values (MONGO_URL, JWT_SECRET, CLOUDINARY_*)  
npm install  
npm run dev  

Frontend Setup  
cd frontend  
npm install  
npm run dev  

Access the app at http://localhost:5173  

Architecture & Tech Stack  
Frontend: React, Vite, TypeScript, Zustand, TailwindCSS  
Backend: Express, TypeScript, MongoDB (Mongoose)  
Storage: Cloudinary (authenticated storage)  
PDF Processing: pdf-lib  
Auth: JWT, bcrypt  
Security & Logging: Morgan, Helmet, CORS  
Architecture: Clean/Hexagonal (Domain → Use Cases → Adapters)  

API Endpoints  
All routes prefixed with /api  

Authentication  
POST /api/auth/register → User registration  
POST /api/auth/login → Returns JWT  
POST /api/auth/logout → Clears user session  

PDF Operations  
POST /api/pdf/upload → Upload a PDF (multipart/form-data, key pdf)  
GET /api/pdf → List all PDFs uploaded by user  
GET /api/pdf/access/:publicId → Get a signed URL to access PDF  
POST /api/pdf/extract → Extract and create new PDF  

Authorization: Send Authorization: Bearer <token> header or use cookie accessToken  

Testing API Endpoints  
Use Postman or Insomnia  
1. Login to retrieve a JWT  
2. Upload a PDF (multipart/form-data, key pdf)  
3. Extract pages by sending this JSON to /api/pdf/extract  

{
  "publicId": "pdfs/USER_ID/original/my.pdf",
  "pages": [1,3,5],
  "order": [2,1,3]
}  

Screenshots  
![Signup Page](screenshots/signup.jpg)  
![Login Page](screenshots/login.jpg)  
![Home Page](screenshots/home.jpg)
![Upload Page](screenshots/upload.jpg)  
![Uploads Page](screenshots/uploads.jpg)  
![Preview Page](screenshots/preview.jpg)  
![PageSelect Page](screenshots/pageselect.jpg)  
![Extraction Result](screenshots/extract.jpg)  

License  
This project is open-source under the MIT License  

Contact  
For inquiries or contributions, reach out via [GitHub](https://github.com/Roshanbtech)  

This version is cleaned up for easy copying and pasting. Let me know if you need any final tweaks!  
You've got this!  
