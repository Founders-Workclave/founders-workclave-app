import {
  ProjectFormData,
  MilestoneFormData,
  Deliverable,
} from "@/types/createPrjects";
import { CreateProjectRequest, ApiProjectResponse } from "@/types/projectApi";

interface ProjectDetailClient {
  id: string;
  name: string;
  email?: string;
  initials: string;
  avatar?: string;
}

interface ProjectDetailManager {
  id: string;
  name: string;
  email?: string;
  initials: string;
  avatar?: string;
}

interface ProjectDetailMilestone {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  status: string;
  price?: number;
  amount?: number;
  dueDate?: string;
  deadline?: string;
  deliverables?: Array<{ id: string; task: string }>;
}

interface ProjectDetailFeature {
  id: string;
  name: string;
}

interface ProjectProgress {
  overallCompletion: number;
  milestones: ProjectDetailMilestone[];
}

interface ProjectDetail {
  id: string;
  projectName?: string;
  name?: string;
  status: string;
  problemStatement?: string;
  description?: string;
  timeline: string;
  expectedTimeline?: string;
  startedAgo: string;
  lastUpdated: string;
  dueDate: string;
  totalBudget: number;
  budgetPaid: number;
  documents: number;
  lastDocumentUpload: string;
  client: ProjectDetailClient;
  clientId?: string;
  productManager?: ProjectDetailManager;
  manager?: ProjectDetailManager;
  managerId?: string;
  productManagerId?: string;
  projectProgress: ProjectProgress;
  milestones?: ProjectDetailMilestone[];
  keyFeatures: ProjectDetailFeature[];
  features?: string[];
}

/**
 * Safely extracts task string from deliverable (handles both string and object)
 */
function getTaskString(d: Deliverable | string | unknown): string {
  if (typeof d === "string") {
    return d;
  }
  if (d && typeof d === "object" && "task" in d) {
    const deliverable = d as Deliverable;
    return typeof deliverable.task === "string" ? deliverable.task : "";
  }
  return "";
}

/**
 * Helper function to check if a milestone is truly empty
 */
function isMilestoneEmpty(milestone: MilestoneFormData): boolean {
  const hasTitle = milestone.title.trim() !== "";
  const hasDescription = milestone.description.trim() !== "";
  const hasAmount = milestone.amount.trim() !== "";
  const hasDueDate = milestone.dueDate !== "";

  const hasValidDeliverables = milestone.deliverables.some((d) => {
    const task = getTaskString(d);
    return task.trim() !== "";
  });

  return (
    !hasTitle &&
    !hasDescription &&
    !hasAmount &&
    !hasDueDate &&
    !hasValidDeliverables
  );
}

/**
 * Transforms the form data from the UI to the API request format
 * Note: File is passed separately, not in the request object
 */
export function transformProjectFormToApiRequest(
  formData: ProjectFormData
): CreateProjectRequest {
  // Filter out empty milestones using the helper function
  const nonEmptyMilestones = formData.milestones.filter(
    (milestone) => !isMilestoneEmpty(milestone)
  );

  // Filter features and convert to backend format
  const filteredFeatures = formData.coreFeatures.filter(
    (feature) => feature.trim() !== ""
  );

  const features =
    filteredFeatures.length > 0
      ? filteredFeatures.map((feature, index) => {
          if (formData.featureIds && formData.featureIds[index]) {
            const existingIdValue = formData.featureIds[index].id;

            const parsedId =
              typeof existingIdValue === "string"
                ? parseInt(existingIdValue, 10)
                : typeof existingIdValue === "number"
                ? existingIdValue
                : NaN;

            if (!isNaN(parsedId) && parsedId > 0) {
              // Existing feature → update
              return {
                id: parsedId,
                feature: feature,
                action: "update" as const,
              };
            }
          }

          // No existing ID → new feature being added
          return {
            feature: feature,
            action: "create" as const,
          };
        })
      : [{ feature: "Feature", action: "create" as const }];

  // Handle deleted features — features that had IDs but are no longer in the form
  const deletedFeatures: { id: number; feature: string; action: "delete" }[] =
    [];

  if (formData.featureIds) {
    formData.featureIds.forEach((fid, index) => {
      // If this featureId exists but the corresponding coreFeature is now empty or removed
      const correspondingFeature = formData.coreFeatures[index];
      if (!correspondingFeature || correspondingFeature.trim() === "") {
        const existingIdValue = fid.id;
        const parsedId =
          typeof existingIdValue === "string"
            ? parseInt(existingIdValue, 10)
            : typeof existingIdValue === "number"
            ? existingIdValue
            : NaN;

        if (!isNaN(parsedId) && parsedId > 0) {
          deletedFeatures.push({
            id: parsedId,
            feature: fid.name || "",
            action: "delete",
          });
        }
      }
    });
  }

  const allFeatures = [...features, ...deletedFeatures];

  console.log("🔄 Transform - Original features:", formData.coreFeatures);
  console.log("🔄 Transform - Existing feature IDs:", formData.featureIds);
  console.log("🔄 Transform - Final features (with actions):", allFeatures);

  // Transform features to match API format: only id and feature, filter out creates without id
  const apiFeatures = allFeatures
    .filter((f) => f.id !== undefined)
    .map((f) => ({
      id: f.id,
      feature: f.feature,
    }));

  return {
    client: formData.clientId,
    projectName: formData.projectName,
    problemStatement: formData.problemStatement,
    timeline: formData.expectedTimeline,
    features: apiFeatures,
    milestones: nonEmptyMilestones.map((milestone) => ({
      title: milestone.title,
      description: milestone.description,
      price: parseFloat(milestone.amount) || 0,
      dueDate: milestone.dueDate,
      deliverables: milestone.deliverables
        .map((d) => getTaskString(d))
        .filter((task) => task && task.trim() !== ""),
    })),
    manager: formData.productManagerId,
  };
}

/**
 * Validates the project form data before submission
 */
export function validateProjectForm(formData: ProjectFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!formData.clientId) {
    errors.push("Please select a client");
  }

  if (!formData.projectName.trim()) {
    errors.push("Project name is required");
  }

  if (!formData.problemStatement.trim()) {
    errors.push("Problem statement is required");
  }

  if (!formData.expectedTimeline) {
    errors.push("Expected timeline is required");
  }

  const validFeatures = formData.coreFeatures.filter((f) => f.trim() !== "");
  if (validFeatures.length === 0) {
    errors.push("At least one core feature is required");
  }

  const nonEmptyMilestones = formData.milestones.filter(
    (milestone) => !isMilestoneEmpty(milestone)
  );

  if (nonEmptyMilestones.length === 0) {
    errors.push("At least one milestone is required");
  }

  nonEmptyMilestones.forEach((milestone) => {
    const milestoneNumber = formData.milestones.indexOf(milestone) + 1;

    if (!milestone.title.trim()) {
      errors.push(`Milestone ${milestoneNumber}: Title is required`);
    }
    if (!milestone.description.trim()) {
      errors.push(`Milestone ${milestoneNumber}: Description is required`);
    }
    if (!milestone.amount || parseFloat(milestone.amount) <= 0) {
      errors.push(`Milestone ${milestoneNumber}: Valid amount is required`);
    }
    if (!milestone.dueDate) {
      errors.push(`Milestone ${milestoneNumber}: Due date is required`);
    }

    const validDeliverables = milestone.deliverables.filter((d) => {
      const task = getTaskString(d);
      return task.trim() !== "";
    });

    if (validDeliverables.length === 0) {
      errors.push(
        `Milestone ${milestoneNumber}: At least one deliverable is required`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Transforms ProjectDetail (from useProjectDetails hook) to form data for editing
 */
export function transformProjectDetailToFormData(
  project: ProjectDetail
): ProjectFormData {
  console.log("🔄 Transforming ProjectDetail to FormData");
  console.log("Original project data:", project);
  console.log("🔍 project.keyFeatures:", project.keyFeatures);

  if (project.keyFeatures) {
    project.keyFeatures.forEach((f, idx) => {
      console.log(`  Feature ${idx}:`, {
        id: f.id,
        idType: typeof f.id,
        name: f.name,
      });
    });
  }

  const clientId =
    typeof project.client === "object"
      ? project.client.id
      : project.clientId || "";

  const managerId =
    project.productManager?.id ||
    project.manager?.id ||
    project.productManagerId ||
    project.managerId ||
    "";

  // Extract features WITH their IDs for editing
  const featuresWithIds =
    project.keyFeatures && project.keyFeatures.length > 0
      ? project.keyFeatures.map((f: ProjectDetailFeature) => ({
          id: f.id,
          name: f.name,
        }))
      : [];

  const features =
    featuresWithIds.length > 0
      ? featuresWithIds.map((f) => f.name).filter((name) => name.trim() !== "")
      : project.features && project.features.length > 0
      ? project.features
      : ["", ""];

  console.log("🔄 Extracted features with IDs:", featuresWithIds);
  console.log("🔄 Extracted features:", features);

  const milestonesSource =
    project.milestones || project.projectProgress?.milestones || [];

  const milestones: MilestoneFormData[] =
    milestonesSource.length > 0
      ? milestonesSource.map((m: ProjectDetailMilestone, index: number) => {
          const deliverables: Deliverable[] = [];

          if (
            m.deliverables &&
            Array.isArray(m.deliverables) &&
            m.deliverables.length > 0
          ) {
            const seen = new Set<string>();
            m.deliverables.forEach((d: { id: string; task: string }) => {
              const task = d.task || "";
              // Deduplicate by task text to prevent doubles from repeated saves
              if (task.trim() !== "" && !seen.has(task.trim())) {
                seen.add(task.trim());
                deliverables.push({
                  id: d.id || String(Math.random()),
                  task,
                });
              }
            });
          }

          return {
            id: m.id || String(index + 1),
            number: index + 1,
            title: m.title || m.name || "",
            description: m.description || "",
            amount: m.price
              ? String(m.price)
              : m.amount
              ? String(m.amount)
              : "",
            dueDate: m.dueDate || m.deadline || "",
            deliverables,
          };
        })
      : [
          {
            id: "1",
            number: 1,
            title: "",
            description: "",
            amount: "",
            dueDate: "",
            deliverables: [],
          },
        ];

  const formData = {
    clientId,
    projectName: project.projectName || project.name || "",
    problemStatement: project.problemStatement || project.description || "",
    expectedTimeline: project.timeline || project.expectedTimeline || "",
    coreFeatures: features,
    featureIds: featuresWithIds,
    prdFile: null,
    milestones,
    productManagerId: managerId,
  };

  console.log("✅ Transformed FormData:", formData);
  return formData;
}

/**
 * Transforms ApiProjectResponse (from API directly) to form data for editing
 */
export function transformApiProjectResponseToFormData(
  apiProject: ApiProjectResponse
): ProjectFormData {
  return {
    clientId: apiProject.client.id,
    projectName: apiProject.projectName,
    problemStatement: apiProject.problemStatement,
    expectedTimeline: apiProject.timeline,
    coreFeatures:
      apiProject.features && apiProject.features.length > 0
        ? apiProject.features
        : ["", ""],
    featureIds: undefined,
    prdFile: null,
    milestones:
      apiProject.milestones && apiProject.milestones.length > 0
        ? apiProject.milestones.map((m, index) => ({
            id: m.id || String(index + 1),
            number: index + 1,
            title: m.title || "",
            description: m.description || "",
            amount: m.price ? String(m.price) : "",
            dueDate: m.dueDate || "",
            deliverables:
              m.deliverables && m.deliverables.length > 0
                ? m.deliverables.map((d, dIndex) => ({
                    id: String(dIndex + 1),
                    task: d || "",
                  }))
                : [],
          }))
        : [
            {
              id: "1",
              number: 1,
              title: "",
              description: "",
              amount: "",
              dueDate: "",
              deliverables: [],
            },
          ],
    productManagerId: apiProject.manager.id,
  };
}

/**
 * Generic transformer that works with both ProjectDetail and ApiProjectResponse
 */
export function transformApiProjectToFormData(
  project: ProjectDetail | ApiProjectResponse
): ProjectFormData {
  if ("projectProgress" in project) {
    return transformProjectDetailToFormData(project as ProjectDetail);
  }

  return transformApiProjectResponseToFormData(project as ApiProjectResponse);
}
