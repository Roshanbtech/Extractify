// import { pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js?timestamp=' + Date.now();
// console.log("PDF Worker Path:", pdfjs.GlobalWorkerOptions.workerSrc);



import { pdfjs } from "react-pdf";

// Set worker source properly
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

console.log("PDF Worker Path:", pdfjs.GlobalWorkerOptions.workerSrc);
