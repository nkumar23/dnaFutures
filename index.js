// This file is only for local development
// The serverless functions will be used by Vercel automatically

console.log('DNA-Text-Protein Converter - Server for local development');
console.log('In production, API endpoints are handled as serverless functions');
console.log('See /server/api directory for the implementation');

// Redirect to client/build in case someone hits this in local development
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(302, { 'Location': '/client/build/index.html' });
  res.end();
}).listen(3000);

console.log('Server running at http://localhost:3000/'); 