/**
 * OCR processor - Extract text from documents using OCR
 */

import { logger } from '@axxiom/shared';
import Tesseract from 'tesseract.js';

/**
 * Process document with OCR
 */
export async function processDocument(params: any): Promise<any> {
  logger.info({ documentType: params.documentType }, 'Processing document with OCR');

  try {
    let imageData: string;

    if (params.documentBase64) {
      imageData = params.documentBase64;
    } else if (params.documentUrl) {
      // In production, would fetch the document
      throw new Error('Document URL processing not yet implemented');
    } else {
      throw new Error('No document provided');
    }

    // Perform OCR using Tesseract.js
    const result = await Tesseract.recognize(imageData, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          logger.debug({ progress: m.progress }, 'OCR progress');
        }
      },
    });

    const extractedText = result.data.text;

    // Extract specific fields based on document type
    let extractedData: any = {
      rawText: extractedText,
      confidence: result.data.confidence,
    };

    if (params.documentType === 'appraisal') {
      extractedData = {
        ...extractedData,
        ...extractAppraisalData(extractedText),
      };
    } else if (params.documentType === 'assessment_notice') {
      extractedData = {
        ...extractedData,
        ...extractAssessmentData(extractedText),
      };
    } else if (params.documentType === 'lease') {
      extractedData = {
        ...extractedData,
        ...extractLeaseData(extractedText),
      };
    }

    // Extract custom fields if specified
    if (params.extractFields) {
      for (const field of params.extractFields) {
        extractedData[field] = extractField(extractedText, field);
      }
    }

    logger.info({ documentType: params.documentType, confidence: result.data.confidence }, 'OCR completed');

    return extractedData;
  } catch (err) {
    logger.error({ err, documentType: params.documentType }, 'OCR processing failed');
    throw err;
  }
}

/**
 * Extract appraisal-specific data
 */
function extractAppraisalData(text: string): any {
  return {
    propertyAddress: extractPattern(text, /(?:property|subject).*?(\d+\s+[\w\s]+(?:st|rd|nd|th|street|avenue|road|drive|blvd))/i),
    appraisedValue: extractCurrency(text, /(?:appraised|market)\s+value.*?\$?([\d,]+)/i),
    effectiveDate: extractDate(text),
    appraiserName: extractPattern(text, /(?:appraiser|prepared by).*?([\w\s]+)/i),
  };
}

/**
 * Extract assessment notice data
 */
function extractAssessmentData(text: string): any {
  return {
    parcelNumber: extractPattern(text, /(?:parcel|APN).*?(\d{3}-\d{3}-\d{3})/i),
    assessedValue: extractCurrency(text, /assessed\s+value.*?\$?([\d,]+)/i),
    landValue: extractCurrency(text, /land\s+value.*?\$?([\d,]+)/i),
    improvementValue: extractCurrency(text, /improvement\s+value.*?\$?([\d,]+)/i),
    taxYear: extractPattern(text, /tax\s+year.*?(\d{4})/i),
  };
}

/**
 * Extract lease data
 */
function extractLeaseData(text: string): any {
  return {
    monthlyRent: extractCurrency(text, /(?:monthly|base)\s+rent.*?\$?([\d,]+)/i),
    leaseTermMonths: extractPattern(text, /(?:term|duration).*?(\d+)\s+months/i),
    squareFeet: extractPattern(text, /(\d+[\d,]*)\s+(?:sq\.?\s*ft|square feet)/i),
    commencementDate: extractDate(text),
  };
}

/**
 * Helper: Extract pattern
 */
function extractPattern(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

/**
 * Helper: Extract currency
 */
function extractCurrency(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);
  return match ? parseInt(match[1].replace(/,/g, '')) : null;
}

/**
 * Helper: Extract date
 */
function extractDate(text: string): string | null {
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i;
  const match = text.match(datePattern);
  return match ? match[1] : null;
}

/**
 * Helper: Extract custom field
 */
function extractField(text: string, fieldName: string): string | null {
  const pattern = new RegExp(`${fieldName}.*?([\\w\\s$,.-]+)`, 'i');
  return extractPattern(text, pattern);
}
