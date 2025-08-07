import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { 
  generationOptionsSchema, 
  requirementSchema, 
  testCaseSchema 
} from "@shared/schema";
import { processTextInput, processFileUpload, processGoogleDoc } from "./services/fileProcessingService";
import { generateTestCases } from "./services/geminiService";
import { generateExcel, generateCSV } from "./services/excelService";
import path from "path";
import { z } from "zod";

// Extend the Express Request interface to include the file property added by multer
declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Text input endpoint
  app.post('/api/analyze/text', async (req: Request, res: Response) => {
    try {
      const { text, options } = req.body;
      
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text input is required' });
      }
      
      const validatedOptions = generationOptionsSchema.parse(options);
      
      // Process the text input
      const requirements = await processTextInput(text);
      
      if (!requirements || requirements.length === 0) {
        return res.status(400).json({ error: 'No requirements could be extracted from the text' });
      }
      
      // Generate test cases using Gemini API
      const testCases = await generateTestCases(requirements, validatedOptions);
      
      return res.status(200).json({ requirements, testCases });
    } catch (error) {
      console.error('Error processing text input:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input format', details: error.format() });
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to process text input';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // File upload endpoint
  app.post('/api/analyze/file', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const options = generationOptionsSchema.parse(JSON.parse(req.body.options || '{}'));
      
      // Process the uploaded file
      const requirements = await processFileUpload(req.file);
      
      if (!requirements || requirements.length === 0) {
        return res.status(400).json({ error: 'No requirements could be extracted from the file' });
      }
      
      // Generate test cases using Gemini API
      const testCases = await generateTestCases(requirements, options);
      
      return res.status(200).json({ requirements, testCases });
    } catch (error) {
      console.error('Error processing file upload:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid options format', details: error.format() });
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to process file upload';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Google Doc integration endpoint
  app.post('/api/analyze/gdoc', async (req: Request, res: Response) => {
    try {
      const { docUrl, options } = req.body;
      
      if (!docUrl || typeof docUrl !== 'string') {
        return res.status(400).json({ error: 'Google Doc URL is required' });
      }
      
      const validatedOptions = generationOptionsSchema.parse(options);
      
      // Process the Google Doc
      const requirements = await processGoogleDoc(docUrl);
      
      if (!requirements || requirements.length === 0) {
        return res.status(400).json({ error: 'No requirements could be extracted from the Google Doc' });
      }
      
      // Generate test cases using Gemini API
      const testCases = await generateTestCases(requirements, validatedOptions);
      
      return res.status(200).json({ requirements, testCases });
    } catch (error) {
      console.error('Error processing Google Doc:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid input format', details: error.format() });
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to process Google Doc';
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Export endpoint
  app.post('/api/export', async (req: Request, res: Response) => {
    try {
      const { requirements, testCases, format, title = 'Test Cases' } = req.body;
      
      if (!requirements || !Array.isArray(requirements)) {
        return res.status(400).json({ error: 'Requirements are required and must be an array format to decode sucessfully' });
      }
      
      if (!testCases || !Array.isArray(testCases)) {
        return res.status(400).json({ error: 'Test cases are required and must be an array' });
      }
      
      // Validate format
      if (format !== 'excel' && format !== 'csv') {
        return res.status(400).json({ error: 'Invalid format. Must be "excel" or "csv"' });
      }
      
      // Validate requirements and test cases
      const validatedRequirements = requirements.map(req => requirementSchema.parse(req));
      const validatedTestCases = testCases.map(tc => testCaseSchema.parse(tc));
      
      // Generate the requested format
      if (format === 'excel') {
        const buffer = await generateExcel(validatedRequirements, validatedTestCases, title);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(title)}.xlsx`);
        
        return res.send(buffer);
      } else {
        const csv = await generateCSV(validatedRequirements, validatedTestCases);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(title)}.csv`);
        
        return res.send(csv);
      }
    } catch (error) {
      console.error('Error exporting test cases:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid data format', details: error.format() });
      }
      return res.status(500).json({ error: 'Failed to export test cases' });
    }
  });

  return httpServer;
}
