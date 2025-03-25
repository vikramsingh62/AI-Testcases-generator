import { google } from "googleapis";
import { Requirement } from "@shared/schema";

/**
 * Authenticate with Google API using API key
 */
function getGoogleClient() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Google API key. Please set GOOGLE_API_KEY environment variable.");
  }
  
  return google.docs({ version: "v1", auth: apiKey });
}

/**
 * Extract document ID from Google Doc URL
 */
function extractDocumentId(url: string): string {
  const match = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (!match || !match[1]) {
    throw new Error("Invalid Google Doc URL");
  }
  return match[1];
}

/**
 * Fetch and extract text from a Google Doc
 */
export async function getGoogleDocContent(docUrl: string): Promise<string> {
  try {
    const docs = getGoogleClient();
    const docId = extractDocumentId(docUrl);
    
    // Fetch the document
    const response = await docs.documents.get({
      documentId: docId,
    });
    
    // Extract text from document
    const document = response.data;
    if (!document.body || !document.body.content) {
      throw new Error("Failed to fetch document content");
    }
    
    // Process the document content to extract text
    let text = "";
    document.body.content.forEach((element: any) => {
      if (element.paragraph && element.paragraph.elements) {
        element.paragraph.elements.forEach((paraElement: any) => {
          if (paraElement.textRun && paraElement.textRun.content) {
            text += paraElement.textRun.content;
          }
        });
      }
    });
    
    return text;
  } catch (error) {
    console.error("Error fetching Google Doc:", error);
    throw new Error(`Failed to fetch Google Doc: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Get metadata for a Google Doc
 */
export async function getGoogleDocMetadata(docUrl: string): Promise<{
  title: string;
  lastUpdated: string;
  previewText: string;
}> {
  try {
    const docs = getGoogleClient();
    const docId = extractDocumentId(docUrl);
    
    // Fetch the document
    const response = await docs.documents.get({
      documentId: docId,
    });
    
    const document = response.data;
    
    // Extract metadata
    const title = document.title || "Untitled Document";
    const lastUpdated = document.revisionId 
      ? new Date().toLocaleDateString() // In real implementation, we'd convert revision timestamp
      : "Unknown";
    
    // Extract preview text (first 200 characters)
    let previewText = "";
    if (document.body && document.body.content) {
      document.body.content.some((element: any) => {
        if (element.paragraph && element.paragraph.elements) {
          element.paragraph.elements.forEach((paraElement: any) => {
            if (paraElement.textRun && paraElement.textRun.content) {
              previewText += paraElement.textRun.content;
              if (previewText.length > 200) return true;
            }
          });
        }
        return previewText.length > 200;
      });
    }
    
    previewText = previewText.substring(0, 200) + (previewText.length > 200 ? "..." : "");
    
    return {
      title,
      lastUpdated,
      previewText
    };
  } catch (error) {
    console.error("Error fetching Google Doc metadata:", error);
    throw new Error(`Failed to fetch Google Doc metadata: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
