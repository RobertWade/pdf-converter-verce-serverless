// Example Node.js script to test the PDF converter API
// Usage: node example.js

const fs = require('fs');
const https = require('https');

// Replace with your actual Vercel deployment URL
const API_URL = 'http://localhost:3000/api/convert';

const sampleHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #333;
    }
    h1 {
      color: #0070f3;
      border-bottom: 2px solid #0070f3;
      padding-bottom: 10px;
    }
    .content {
      line-height: 1.6;
      margin-top: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #0070f3;
      color: white;
    }
  </style>
</head>
<body>
  <h1>Sample PDF Document</h1>
  <div class="content">
    <p>This is a sample document generated from HTML to PDF.</p>
    <p>Generated at: ${new Date().toLocaleString()}</p>
    
    <h2>Features</h2>
    <ul>
      <li>Supports CSS styling</li>
      <li>Preserves layout and formatting</li>
      <li>Fast and serverless</li>
      <li>Easy to integrate</li>
    </ul>
    
    <h2>Sample Table</h2>
    <table>
      <tr>
        <th>Name</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>HTML</td>
        <td>HyperText Markup Language</td>
      </tr>
      <tr>
        <td>CSS</td>
        <td>Cascading Style Sheets</td>
      </tr>
      <tr>
        <td>PDF</td>
        <td>Portable Document Format</td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

async function convertToPDF() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html: sampleHTML }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error || response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const outputPath = 'example-output.pdf';
    
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    console.log(`✓ PDF generated successfully: ${outputPath}`);
    console.log(`  File size: ${(buffer.byteLength / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

convertToPDF();
