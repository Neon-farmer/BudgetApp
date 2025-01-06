import express from 'express';
import path from 'path';

const app = express();

// Serve static files from the React app's dist directory
const distPath = path.join(__dirname, 'dist');  // Make sure dist is in the correct location
app.use(express.static(distPath));

// All other requests should return the index.html from the dist folder (for React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Set the server to listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
