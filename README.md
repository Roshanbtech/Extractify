<head>
  <link href="https://fonts.googleapis.com/css2?family=Atomic+Age&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Atomic Age', cursive; background-color: #0e0b16; color: #e7dfdd; }
    .banner { background: linear-gradient(135deg, #5c30cf, #00ffea); padding: 2rem; text-align: center; border-radius: 12px; margin-bottom: 1rem; }
    .banner h1 { font-size: 3rem; color: #f6f5f5; }
    .banner p { font-size: 1.25rem; color: #f6f5f5; }
    .badge { margin: 0 .25rem; }
    .section { margin: 2rem 0; }
    .table-grid { width: 100%; border-collapse: collapse; }
    .table-grid td { padding: .5rem; }
    .table-grid img { width: 100%; border: 2px solid #5c30cf; border-radius: 8px; }
    a { color: #00ffea; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { background: #1a1a2e; padding: .2rem .4rem; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="banner">
    <h1>📑 Extractify</h1>
    <p>PDF Page Extractor Application</p>
    <a class="badge" href="https://extractify-91.vercel.app"><img src="https://img.shields.io/badge/Frontend-Live-blue.svg" alt="Frontend Live"></a>
    <a class="badge" href="https://extractify-server.vercel.app"><img src="https://img.shields.io/badge/API-Live-green.svg" alt="API Live"></a>
  </div>

  <div class="section">
    <h2>Live Demo</h2>
    <p>Frontend: <a href="https://extractify-91.vercel.app">https://extractify-91.vercel.app</a></p>
    <p>Backend API: <a href="https://extractify-server.vercel.app">https://extractify-server.vercel.app</a></p>
  </div>

  <div class="section">
    <h2>Overview</h2>
    <ul>
      <li>Upload secure PDFs</li>
      <li>View all pages of an uploaded PDF</li>
      <li>Select and reorder pages before extraction</li>
      <li>Download a newly generated PDF</li>
      <li>Delete unwanted PDFs</li>
      <li>Authenticated user management for document storage</li>
    </ul>
  </div>

  <div class="section">
    <h2>Quick Start</h2>
    <p>Clone the Repository and change directory:</p>
    <code>git clone https://github.com/Roshanbtech/Extractify.git &amp;&amp; cd Extractify</code>
    <h3>Backend</h3>
    <code>cd backend &amp;&amp; cp .env.example .env &amp;&amp; npm install &amp;&amp; npm run dev</code>
    <h3>Frontend</h3>
    <code>cd frontend &amp;&amp; npm install &amp;&amp; npm run dev</code>
    <p>Access the app at <a href="http://localhost:5173">http://localhost:5173</a>.</p>
  </div>

  <div class="section">
    <h2>Architecture &amp; Tech Stack</h2>
    <p><strong>Frontend:</strong> React, Vite, TypeScript, Zustand, TailwindCSS</p>
    <p><strong>Backend:</strong> Express, TypeScript, MongoDB (Mongoose)</p>
    <p><strong>Storage:</strong> Cloudinary (authenticated storage)</p>
    <p><strong>PDF Processing:</strong> pdf-lib</p>
    <p><strong>Auth:</strong> JWT, bcrypt</p>
    <p><strong>Security &amp; Logging:</strong> Morgan, Helmet, CORS</p>
    <p><strong>Architecture:</strong> Clean/Hexagonal (Domain → Use Cases → Adapters)</p>
  </div>

  <div class="section">
    <h2>API Endpoints</h2>
    <h3>Authentication</h3>
    <ul>
      <li>POST <code>/api/auth/register</code> – User registration</li>
      <li>POST <code>/api/auth/login</code> – Returns JWT</li>
      <li>POST <code>/api/auth/logout</code> – Clears user session</li>
    </ul>

    <h3>PDF Operations</h3>
    <ul>
      <li>POST <code>/api/pdf/upload</code> – Upload a PDF (<em>multipart/form-data</em>, key <code>pdf</code>)</li>
      <li>GET <code>/api/pdf</code> – List all PDFs for user</li>
      <li>GET <code>/api/pdf/access/:publicId</code> – Get signed URL</li>
      <li>POST <code>/api/pdf/extract</code> – Extract &amp; create new PDF</li>
    </ul>

    <p>Authorization: <code>Authorization: Bearer &lt;token&gt;</code> header or cookie <code>accessToken</code>.</p>
  </div>

  <div class="section">
    <h2>Screenshots</h2>
    <table class="table-grid">
      <tr>
        <td><img src="./screenshots/signup.jpg" alt="Signup Page"></td>
        <td><img src="./screenshots/login.jpg" alt="Login Page"></td>
      </tr>
      <tr>
        <td><img src="./screenshots/home.jpg" alt="Home Page"></td>
        <td><img src="./screenshots/upload.jpg" alt="Upload Page"></td>
      </tr>
      <tr>
        <td><img src="./screenshots/preview.jpg" alt="Preview Page"></td>
        <td><img src="./screenshots/pageselect.jpg" alt="Page Selection"></td>
      </tr>
      <tr>
        <td colspan="2"><img src="./screenshots/extract.jpg" alt="Extraction Result"></td>
        <td colspan="2"><img src="./screenshots/uploads.jpg" alt="Uploads"></td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>Testing</h2>
    <p>Use Postman or Insomnia:</p>
    <ol>
      <li>Login to retrieve JWT</li>
      <li>Upload a PDF (<em>multipart/form-data</em>, key <code>pdf</code>)</li>
      <li>Extract pages by POSTing JSON to <code>/api/pdf/extract</code>:</li>
    </ol>
    <code>{ "publicId": "pdfs/USER_ID/original/my.pdf", "pages": [1,3,5], "order": [2,1,3] }</code>
  </div>

  <div class="section">
    <h2>License</h2>
    <p>MIT • <a href="https://github.com/Roshanbtech">Roshanbtech</a></p>
  </div>
</body>
