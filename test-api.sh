#!/bin/bash
# Simple test script for the PDF converter API
# Usage: ./test-api.sh [API_URL]

API_URL="${1:-http://localhost:3000/api/convert}"
OUTPUT_FILE="test-output.pdf"

echo "Testing PDF Converter API..."
echo "API URL: $API_URL"
echo ""

# Sample HTML content
HTML_CONTENT='<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    h1 { color: #0070f3; }
    .info { background-color: #f0f0f0; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>Test PDF Document</h1>
  <div class="info">
    <p>This PDF was generated using the serverless API.</p>
    <p>Generated at: '"$(date)"'</p>
  </div>
  <h2>Test Content</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
    <li>Feature 3</li>
  </ul>
</body>
</html>'

# Make the API call
echo "Sending request..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"html\": $(echo "$HTML_CONTENT" | jq -Rs .)}" \
  --output "$OUTPUT_FILE")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✓ Success! PDF generated and saved to: $OUTPUT_FILE"
  FILE_SIZE=$(ls -lh "$OUTPUT_FILE" | awk '{print $5}')
  echo "  File size: $FILE_SIZE"
else
  echo "✗ Error: HTTP $HTTP_CODE"
  cat "$OUTPUT_FILE"
  rm "$OUTPUT_FILE"
  exit 1
fi
