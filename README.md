# PDF Converter - Vercel Serverless

A serverless function deployed on Vercel that converts HTML to PDF using Node.js and Puppeteer.

## Features

- 🚀 Serverless architecture using Vercel Functions
- 📄 HTML to PDF conversion
- 🎨 Supports CSS styling and print backgrounds
- ⚡ Fast and scalable

## API Endpoint

### POST /api/convert

Converts HTML content to a PDF file.

**Request Body:**
```json
{
  "html": "<html><body><h1>Hello World</h1></body></html>"
}
```

**Response:**
- Content-Type: `application/pdf`
- Returns the generated PDF file

**Example using cURL:**
```bash
curl -X POST https://your-deployment.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"html": "<html><body><h1>Hello World</h1><p>This is a test PDF.</p></body></html>"}' \
  --output test.pdf
```

**Example using JavaScript (fetch):**
```javascript
const html = '<html><body><h1>Hello World</h1></body></html>';

fetch('https://your-deployment.vercel.app/api/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ html }),
})
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.pdf';
    a.click();
  });
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or click the button below to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RobertWade/pdf-converter-verce-serverless)

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Run locally:
```bash
vercel dev
```

4. Test the endpoint:
```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"html": "<html><body><h1>Test</h1></body></html>"}' \
  --output test.pdf
```

## Technical Details

- **Runtime:** Node.js
- **PDF Engine:** Puppeteer Core with Chromium
- **Memory:** 1024 MB
- **Max Duration:** 10 seconds

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success, PDF generated
- `400` - Bad request (missing HTML content)
- `405` - Method not allowed (only POST is accepted)
- `500` - Internal server error (PDF generation failed)

## License

ISC