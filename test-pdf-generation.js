// Test script to validate PDF generation
const handler = require('./api/convert.js');
const fs = require('fs');

async function testPDFGeneration() {
  console.log('Testing PDF generation...\n');
  
  const testCases = [
    {
      name: 'Simple HTML',
      html: '<h1>Hello World</h1><p>This is a test PDF.</p>',
      outputFile: '/tmp/test-simple.pdf'
    },
    {
      name: 'HTML with styles',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #0070f3; }
            .info { background-color: #f0f0f0; padding: 15px; }
          </style>
        </head>
        <body>
          <h1>Styled PDF Document</h1>
          <div class="info">
            <p>This PDF has custom CSS styling.</p>
          </div>
        </body>
        </html>
      `,
      outputFile: '/tmp/test-styled.pdf'
    },
    {
      name: 'Complex HTML',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #4CAF50; color: white; }
          </style>
        </head>
        <body>
          <h1>Complex Document</h1>
          <table>
            <tr><th>Name</th><th>Value</th></tr>
            <tr><td>Test 1</td><td>Data 1</td></tr>
            <tr><td>Test 2</td><td>Data 2</td></tr>
          </table>
        </body>
        </html>
      `,
      outputFile: '/tmp/test-complex.pdf'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const mockReq = {
        method: 'POST',
        body: { html: testCase.html }
      };
      
      let capturedData = null;
      const mockRes = {
        statusCode: 200,
        headers: {},
        status(code) { 
          this.statusCode = code; 
          return this; 
        },
        json(data) { 
          console.error(`  ✗ Error response: ${JSON.stringify(data)}`);
          return this; 
        },
        setHeader(key, value) { 
          this.headers[key] = value; 
        },
        send(data) {
          capturedData = data;
          return this;
        }
      };
      
      await handler(mockReq, mockRes);
      
      // Validate the response
      if (mockRes.statusCode !== 200) {
        throw new Error(`Wrong status code: ${mockRes.statusCode}`);
      }
      
      if (!capturedData) {
        throw new Error('No data returned');
      }
      
      if (!Buffer.isBuffer(capturedData)) {
        throw new Error(`Data is not a Buffer, it's a ${capturedData.constructor.name}`);
      }
      
      // Check PDF structure
      const header = capturedData.slice(0, 4).toString();
      if (header !== '%PDF') {
        throw new Error(`Invalid PDF header: ${header}`);
      }
      
      const pdfContent = capturedData.toString();
      if (!pdfContent.includes('%%EOF')) {
        throw new Error('PDF is missing EOF marker');
      }
      
      // Save the file
      fs.writeFileSync(testCase.outputFile, capturedData);
      
      // Verify file size
      const fileSize = fs.statSync(testCase.outputFile).size;
      if (fileSize < 1000) {
        throw new Error(`PDF file too small: ${fileSize} bytes`);
      }
      
      console.log(`  ✓ Passed (${fileSize} bytes, saved to ${testCase.outputFile})`);
      passed++;
      
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`${'='.repeat(50)}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

testPDFGeneration().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
