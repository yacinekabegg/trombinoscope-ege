export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentNumber: string;
  photo?: string;
}

export interface Module {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface Project {
  id: string;
  moduleId: string;
  name: string;
  description?: string;
  deadline: Date;
  studentIds: string[];
  status: ProjectStatus;
  submissionDate?: Date;
  grade?: number;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  NOT_SUBMITTED = 'Non remis',
  SUBMITTED = 'Remis',
  TO_CORRECT = 'À corriger',
  VALIDATED = 'Validé'
}

export interface ProjectWithDetails extends Project {
  module: Module;
  students: Student[];
}

export interface StudentWithProjects extends Student {
  projects: ProjectWithDetails[];
}

export interface ModuleWithProjects extends Module {
  projects: ProjectWithDetails[];
}

export interface DashboardStats {
  totalStudents: number;
  totalProjects: number;
  submittedProjects: number;
  pendingCorrections: number;
  averageGrade: number;
}

export interface ExportOptions {
  format: 'excel' | 'pdf';
  include: {
    students: boolean;
    projects: boolean;
    grades: boolean;
    photos: boolean;
  };
}
