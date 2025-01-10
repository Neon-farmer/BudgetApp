import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Get the current directory path

const server = http.createServer((req, res) => {
  // Serve the index.html file from the dist directory
  if (req.url === '/' || req.url === '') {
    const filePath = path.join(__dirname, 'dist', 'index.html');
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error(`Error loading index.html from ${filePath}:`, err);
        res.statusCode = 500;
        res.end('Error loading index.html');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else {
    // Handle static file requests (CSS, JS, etc.)
    const filePath = path.join(__dirname, 'dist', req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/plain';

    switch (extname) {
      case '.js':
        contentType = 'application/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.html':
        contentType = 'text/html';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      // Add more cases as necessary
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error(`File not found: ${filePath}`, err);
        res.statusCode = 404;
        res.end('File not found');
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content);
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
