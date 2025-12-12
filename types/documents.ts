export interface Document {
  id: number;
  title: string;
  type: string;
  size: string;
  uploadDate: string;
  url: string;
  icon: string;
}

export interface ProjectDocuments {
  projectId: number;
  documents: Document[];
}
