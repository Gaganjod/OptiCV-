const fs = require('fs');
const pdfParse = require('pdf-parse');

console.log("pdfParse type:", typeof pdfParse);
if (typeof pdfParse === 'object') {
    console.log("pdfParse keys:", Object.keys(pdfParse));
}

// create a dummy PDF to test or just inspect the import
console.log("pdfParse is function?", typeof pdfParse === 'function');
