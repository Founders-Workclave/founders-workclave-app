import { getAuthHeaders } from "@/lib/utils/auth";

export interface Document {
  id: number;
  description: string | null;
  documentUrl: string;
  uploadedAt: string;
}

interface DocumentResponse {
  message: string;
  prds: Document[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class DocumentService {
  /**
   * Fetch documents/PRDs for a specific project
   * @param projectId - The project ID
   * @returns Promise with array of documents
   */
  static async getDocuments(projectId: string): Promise<Document[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/founder/project/${projectId}/prds/`,
        {
          method: "GET",
          headers: getAuthHeaders(),
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        throw new Error("Unauthorized. Please log in again.");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.statusText}`);
      }

      const data: DocumentResponse = await response.json();
      return data.prds || [];
    } catch (error) {
      console.error("Error in getDocuments:", error);
      throw error;
    }
  }

  /**
   * Get a single document by ID
   * @param projectId - The project ID
   * @param documentId - The document ID
   * @returns Promise with document data
   */
  static async getDocumentById(
    projectId: string,
    documentId: number
  ): Promise<Document> {
    try {
      const documents = await this.getDocuments(projectId);
      const document = documents.find((d) => d.id === documentId);

      if (!document) {
        throw new Error(`Document ${documentId} not found`);
      }

      return document;
    } catch (error) {
      console.error("Error in getDocumentById:", error);
      throw error;
    }
  }

  /**
   * Extract filename from Cloudinary URL
   * @param url - The Cloudinary URL
   * @returns Filename with extension
   */
  static getFilenameFromUrl(url: string): string {
    try {
      const urlParts = url.split("/");
      const filenamePart = urlParts[urlParts.length - 1];
      // Extract the filename before the underscore hash
      const filename = filenamePart.split("_")[0];
      return filename || "document";
    } catch {
      return "document";
    }
  }

  /**
   * Get file extension from URL
   * @param url - The document URL
   * @returns File extension
   */
  static getFileExtension(url: string): string {
    try {
      const urlWithoutQuery = url.split("?")[0];
      const extension = urlWithoutQuery.split(".").pop()?.toUpperCase();
      return extension || "FILE";
    } catch {
      return "FILE";
    }
  }

  /**
   * Download a document
   * @param url - The document URL
   * @param filename - The filename to save as
   */
  static downloadDocument(url: string, filename: string): void {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
