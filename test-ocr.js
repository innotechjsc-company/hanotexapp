// Test script for OCR API
const fs = require('fs');
const FormData = require('form-data');

async function testOCR() {
  try {
    console.log('🧪 Testing OCR API...');
    
    // Create a test file (simulate images.jpg)
    const testFile = Buffer.from('test image content');
    
    const formData = new FormData();
    formData.append('file', testFile, {
      filename: 'images.jpg',
      contentType: 'image/jpeg'
    });

    const response = await fetch('http://localhost:3000/api/ocr/process', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ OCR API Response:');
    console.log(JSON.stringify(result, null, 2));
    
    // Check if extracted data is correct for images.jpg
    if (result.extractedData) {
      console.log('\n📋 Extracted Data Summary:');
      console.log(`Title: ${result.extractedData.title}`);
      console.log(`Field: ${result.extractedData.field}`);
      console.log(`Category: ${result.extractedData.category}`);
      console.log(`Subcategory: ${result.extractedData.subcategory}`);
      console.log(`TRL Suggestion: ${result.extractedData.trlSuggestion}`);
      console.log(`Confidence: ${Math.round(result.extractedData.confidence * 100)}%`);
    }
    
  } catch (error) {
    console.error('❌ OCR Test Failed:', error.message);
  }
}

// Run test
testOCR();
