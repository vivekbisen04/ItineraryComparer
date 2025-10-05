/**
 * Simple PDF Parser - LLM Only (No Regex)
 * Extracts text from PDF and sends to Gemini for parsing
 */

import * as pdfjsLib from 'pdfjs-dist';
import { parseItineraryWithLLM } from '../../backend/src/geminiParser';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Sort items by Y position then X position for proper reading order
      const sortedItems = textContent.items.sort((a, b) => {
        const yDiff = Math.abs(a.transform[5] - b.transform[5]);
        if (yDiff < 5) return a.transform[4] - b.transform[4]; // Same line, sort by X
        return b.transform[5] - a.transform[5]; // Different lines, sort by Y (top to bottom)
      });

      const pageText = sortedItems.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract PDF content: ' + error.message);
  }
}

/**
 * Main function: Parse PDF to itinerary using LLM only
 */
export async function parsePDFToItinerary(file) {
  try {
    console.log('📄 Extracting text from PDF...');
    const pdfText = await extractTextFromPDF(file);

    console.log(`✅ Extracted ${pdfText.length} characters from PDF`);

    // Get API key from environment
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API key not found. Please add VITE_GOOGLE_API_KEY to your .env file');
    }

    console.log('🤖 Sending to Gemini AI for parsing...');
    const parsedData = await parseItineraryWithLLM(pdfText, apiKey);

    console.log('✅ Parsing complete!');
    return parsedData;

  } catch (error) {
    console.error('❌ Parsing failed:', error);
    throw error;
  }
}
