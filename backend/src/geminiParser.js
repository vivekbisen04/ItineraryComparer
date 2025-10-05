/**
 * Simple LLM-based PDF parser using Google Gemini
 * No regex, just pure AI extraction
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Parse PDF text using Gemini LLM
 */
export async function parseItineraryWithLLM(pdfText, apiKey) {
  if (!apiKey) {
    throw new Error('Google API key is required');
  }

  console.log('🤖 Parsing itinerary with Gemini AI...');

  const genAI = new GoogleGenerativeAI(apiKey);

  // Use gemini-pro which is stable and widely available
  const model = genAI.getGenerativeModel({
    model:"gemini-2.5-flash",
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
    },
  });

  const prompt = `You are an expert travel itinerary analyzer. Extract ALL information from this travel package PDF.

IMPORTANT RULES:
1. Extract the EXACT cost per person and total package cost from tables or pricing sections
2. Look for sections like "Tour Costing Details", "Cost per Adult", "Total Package Cost"
3. Extract EVERY single day from the itinerary - do not skip any days
4. Extract ALL inclusions and exclusions
5. Return ONLY valid JSON (no markdown, no code blocks, no explanations)

Required JSON structure:
{
  "name": "Package name from PDF",
  "overview": {
    "duration": {
      "nights": <number>,
      "days": <number>
    },
    "cost": {
      "total": <number without currency symbols or commas>,
      "perPerson": <number without currency symbols or commas>,
      "currency": "INR" or "USD" etc
    },
    "participants": {
      "adults": <number>,
      "children": <number>
    }
  },
  "destinations": ["City 1", "City 2", ...],
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 title",
      "description": "Brief description",
      "activities": ["Activity 1", "Activity 2", ...],
      "meals": {
        "breakfast": true/false,
        "lunch": true/false,
        "dinner": true/false
      },
      "accommodation": {
        "hotel": "Hotel name or empty string",
        "roomType": "Room type or empty string"
      }
    }
  ],
  "transport": {
    "arrival": {
      "mode": "Flight/Train/etc",
      "details": "Airport/Station name"
    },
    "departure": {
      "mode": "Flight/Train/etc",
      "details": "Airport/Station name"
    },
    "included": ["Private vehicle", "Ferry transfers", ...]
  },
  "inclusions": ["Accommodation", "Meals", "Transport", ...],
  "exclusions": ["Airfare", "Personal expenses", ...],
  "pricing": {
    "basePackage": <same as perPerson cost>,
    "additionalCosts": []
  }
}

PDF Content:
${pdfText}

Return ONLY the JSON object:`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    console.log('✅ Gemini response received');

    // Clean up response - remove markdown code blocks if present
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    const parsedData = JSON.parse(text);

    // Add metadata
    parsedData.metadata = {
      parsingMethod: 'llm',
      model: 'gemini-1.5-flash',
      timestamp: new Date().toISOString(),
    };

    console.log('✅ Successfully parsed itinerary with LLM');
    return parsedData;

  } catch (error) {
    console.error('❌ LLM parsing failed:', error);
    throw new Error(`Failed to parse itinerary: ${error.message}`);
  }
}

/**
 * Validate parsed data structure
 */
export function validateItineraryData(data) {
  const errors = [];

  if (!data.name) errors.push('Missing package name');
  if (!data.overview?.cost?.perPerson) errors.push('Missing per-person cost');
  if (!data.overview?.duration?.nights) errors.push('Missing duration');
  if (!data.itinerary || data.itinerary.length === 0) errors.push('Missing itinerary days');

  if (errors.length > 0) {
    console.warn('⚠️ Validation warnings:', errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: errors,
  };
}
