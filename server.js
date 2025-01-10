import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Get the current directory path

const server = http.createServer((req, res) => {
  const safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, ''); // Prevent directory traversal
  const filePath = path.join(__dirname, 'build', safePath === '/' ? 'index.html' : safePath);

  // Determine the content type based on file extension
  const extname = path.extname(filePath);
  let contentType = 'application/octet-stream'; // Default content type for unknown files

  switch (extname) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    // Add more cases for other file types as needed
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error serving file: ${filePath} - ${err.message}`);
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('404: File Not Found');
      } else {
        res.statusCode = 500;
        res.end('500: Internal Server Error');
      }
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(content);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
