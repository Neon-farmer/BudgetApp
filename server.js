// Import required modules
import http from 'http';
import os from 'os';
import url from 'url';

// Create the HTTP server
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const currentPath = process.cwd();
    const scriptPath = new URL('.', import.meta.url).pathname;

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const currentUrl = `${protocol}://${req.headers.host}${req.url}`;

    const envVariables = [
        "PORT",
        "HTTP_PLATFORM_IIS_APP_POOL_ID",
        "HTTP_PLATFORM_IIS_SITE_ID",
        "HTTP_PLATFORM_IIS_SITE_NAME",
        "HTTP_PLATFORM_IIS_VERSION",
        "HTTP_PLATFORM_IIS_HTTPAUTH",
        "HTTP_PLATFORM_PORT",
        "HTTP_PLATFORM_TOKEN",
        "HTTP_PLATFORM_APPL_PATH",
        "HTTP_PLATFORM_IIS_WEBSOCKETS_SUPPORTED"
    ];

    let html = `
        <h1>Server Information:</h1>
        <ul>
            <li><strong>Node version:</strong> ${process.version}</li>
            <li><strong>Environment:</strong> ${process.env['NODE_ENV'] || 'Not set'}</li>
            <li><strong>Working Directory:</strong> ${currentPath}</li>
            <li><strong>Script Path:</strong> ${scriptPath}</li>
        </ul>

        <h2>Request URL:</h2>
        <ul>
            <li><strong>Current URL:</strong> ${currentUrl}</li>
            <li><strong>Host:</strong> ${req.headers.host}</li>
            <li><strong>Original URL:</strong> ${req.headers['x-original-url'] || 'Not set'}</li>
            <li><strong>Rewrite URL:</strong> ${req.headers['x-rewrite-url'] || 'Not set'}</li>
            <li><strong>Protocol:</strong> ${protocol}</li>
        </ul>

        <h2>Environment Variables:</h2>
        <ul>
    `;

    envVariables.forEach(variable => {
        html += `<li><strong>${variable}:</strong> ${process.env[variable] || 'Not set'}</li>`;
    });

    html += `
        </ul>
        
        <h2>Request Headers:</h2>
        <ul>
    `;

    for (const header in req.headers) {
        html += `<li><strong>${header}:</strong> ${req.headers[header]}</li>`;
    }

    html += `
        </ul>
    `;

    res.end(html);
}).listen(process.env.PORT || 3000);
