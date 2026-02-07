import { getAuthToken } from "@/lib/api/auth";
import {
  RegisterClientRequest,
  RegisterClientResponse,
  ApiErrorResponse,
} from "@/types/createClientsApi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export const clientService = {
  /**
   * Registers a new client
   * @param clientData - Client registration data
   * @returns Promise with the registration response
   */
  async registerClient(
    clientData: RegisterClientRequest
  ): Promise<RegisterClientResponse> {
    try {
      const token = getAuthToken();

      // 🐛 DEBUG: Log what we're sending (development only)
      if (process.env.NODE_ENV === "development") {
        console.log("=== REGISTER CLIENT API CALL ===");
        console.log("Endpoint:", `${API_BASE_URL}/agency/register-client/`);
        console.log("Data:", {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          email: clientData.email,
          phone: clientData.phone,
          // Don't log password for security
          password: "[REDACTED]",
        });
        console.log("================================");
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/agency/register-client/`, {
        method: "POST",
        headers,
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response
          .json()
          .catch(() => ({ message: "Failed to register client" }));

        // 🐛 DEBUG: Log detailed error (development only)
        if (process.env.NODE_ENV === "development") {
          console.error("=== API ERROR RESPONSE ===");
          console.error("Status:", response.status);
          console.error("Error Data:", errorData);
          console.error("=========================");
        }

        // Parse Django REST Framework validation errors
        let errorMessage = "Failed to register client";

        // Handle 409 Conflict (duplicate entry)
        if (response.status === 409) {
          if (errorData.error && typeof errorData.error === "string") {
            const errorStr = errorData.error.toLowerCase();

            // Check for specific duplicate field errors
            if (errorStr.includes("email")) {
              errorMessage = "This email address is already registered";
            } else if (errorStr.includes("phone")) {
              errorMessage = "This phone number is already registered";
            } else if (errorStr.includes("agency_id")) {
              errorMessage = "A client with this information already exists";
            } else {
              errorMessage =
                errorData.message || "This information is already registered";
            }
          } else {
            errorMessage =
              errorData.message ||
              "A client with this information already exists";
          }
        }
        // Handle Django REST Framework validation errors (400 Bad Request)
        else if (errorData.error && typeof errorData.error === "string") {
          // Try to parse the stringified error object from Django REST Framework
          try {
            const jsonString = errorData.error
              .replace(/'/g, '"')
              .replace(/ErrorDetail\(string=/g, "")
              .replace(/, code='[\w]+'\)/g, "")
              .replace(/\(/g, "")
              .replace(/\)/g, "");

            const parsedError = JSON.parse(jsonString);

            const fieldErrors = Object.entries(parsedError)
              .map(([field, errors]) => {
                // Handle array of errors
                if (Array.isArray(errors) && errors.length > 0) {
                  const errorMsg = errors[0];
                  // Format field name nicely
                  const fieldName = field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())
                    .trim();
                  return `${fieldName}: ${errorMsg}`;
                }
                return null;
              })
              .filter(Boolean)
              .join(". ");

            errorMessage =
              fieldErrors || errorData.message || "Failed to register client";
          } catch (parseError) {
            // If parsing fails, try to extract a readable message
            if (process.env.NODE_ENV === "development") {
              console.warn("Could not parse error:", parseError);
            }

            // Try to extract the message using regex as fallback
            const match = errorData.error.match(/string='([^']+)'/);
            if (match && match[1]) {
              errorMessage = match[1];
            } else {
              errorMessage = errorData.error;
            }
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }

        throw new ApiError(errorMessage, response.status, errorData);
      }

      const responseData: RegisterClientResponse = await response.json();
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Client registered successfully:", responseData);
      }
      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new ApiError(`Network error: ${error.message}`);
      }

      throw new ApiError("An unknown error occurred while registering client");
    }
  },
};
