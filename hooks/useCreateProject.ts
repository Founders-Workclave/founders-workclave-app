import { useState } from "react";
import { ProjectFormData } from "@/types/createPrjects";
import { projectService } from "@/lib/api/createProject/project";
import {
  transformProjectFormToApiRequest,
  validateProjectForm,
} from "@/utils/createProjectTransformers";

interface UseCreateProjectReturn {
  isSubmitting: boolean;
  error: string | null;
  submitProject: (formData: ProjectFormData) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for handling project creation logic
 *
 * @example
 * const { isSubmitting, error, submitProject, clearError } = useCreateProject();
 *
 * const handleSubmit = async () => {
 *   const success = await submitProject(formData);
 *   if (success) {
 *     // Handle success
 *   }
 * };
 */
export function useCreateProject(): UseCreateProjectReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitProject = async (formData: ProjectFormData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate form data
      const validation = validateProjectForm(formData);
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return false;
      }

      // Transform form data to API request format
      const apiRequest = transformProjectFormToApiRequest(formData);

      // Submit project with PRD file if exists
      await projectService.createProject(
        apiRequest,
        formData.prdFile || undefined
      );

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create project";
      setError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isSubmitting,
    error,
    submitProject,
    clearError,
  };
}
