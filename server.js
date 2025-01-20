import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Get the current directory path

const server = http.createServer((req, res) => {
  const wwwrootPath = path.join(__dirname, "wwwroot");
  let filePath = path.join(wwwrootPath, req.url);

  // Check for a file extension to identify static files
  const extname = path.extname(req.url);

  // Determine content type based on file extension
  const contentTypeMap = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
  };
  const contentType = contentTypeMap[extname] || "text/plain";

  // Handle requests without file extensions (React routes)
  if (!extname) {
    filePath = path.join(wwwrootPath, "index.html");
  }

  // Read the requested file and respond
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File not found, return 404
        res.statusCode = 404;
        res.end("404: File not found");
      } else {
        // Other server error
        res.statusCode = 500;
        res.end("500: Internal server error");
      }
    } else {
      // Serve the file with the correct content type
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      res.end(content);
    }
  });
});

// Serve the React app for all paths that don't match a static file
server.use((req, res, next) => {
    const filePath = path.join(__dirname, 'wwwroot', req.url);
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return next();  // Pass control to the next middleware (static file handler)
      }
      res.sendFile(filePath);
    });
  });
  
  // Serve index.html for all non-static requests
  server.use((req, res) => {
    const filePath = path.join(__dirname, 'wwwroot', 'index.html');
    res.sendFile(filePath);
  });
  
// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
