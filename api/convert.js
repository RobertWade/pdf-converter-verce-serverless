const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { html } = req.body;

  if (!html) {
    return res.status(400).json({ error: 'HTML content is required in the request body.' });
  }

  let browser = null;

  try {
    // Launch browser with chromium
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
    
    // Send the PDF
    return res.status(200).send(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ 
      error: 'Failed to generate PDF', 
      message: error.message 
    });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
