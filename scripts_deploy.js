const https = require('https');
const fs = require('fs');

const zipData = fs.readFileSync('deploy.zip');

const req = https.request('https://api.netlify.com/api/v1/sites', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/zip',
    'Content-Length': zipData.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', (e) => console.error('Upload error:', e.message));
req.write(zipData);
req.end();
