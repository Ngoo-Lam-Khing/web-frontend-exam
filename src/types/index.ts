export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  educationId: number;
  salaryId: number;
  preview: string;
  companyPhoto: string[];
  description: string;
}
/** List item from GET /api/v1/jobs (includes stable id for GET /api/v1/jobs/:id) */
export type JobListItem = Omit<Job, 'companyPhoto' | 'description'>;
export interface JobsResponse {
  data: JobListItem[];
  total: number;
}
/** Detail from GET /api/v1/jobs/:id (preview, educationId, salaryId omitted) */
export type JobDetail = Omit<Job, 'preview' | 'educationId' | 'salaryId'>;

export interface EducationItem {
  id: number;
  label: string;
}

export interface SalaryItem {
  id: number;
  label: string;
}

export interface JobFilters {
  companyName: string;
  educationLevel: number;
  salaryLevel: number;
}
