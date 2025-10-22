import { OgOrganization, OgProduct } from "@/apiHooks.ts/organization/organization.types";

export interface JobProgress {
  jobId: string;
  organizationId: string;
  subDomainName: string;
  status: 'queued' | 'in-progress' | 'completed' | 'failed';
  currentStep: string;
  totalSteps: number;
  currentStepNumber: number;
  progress: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

export interface LeadRegistrationStep {
  name: string;
  description: string;
  order: number;
}

export interface SSEEvent {
  type: 'connected' | 'progress' | 'heartbeat' | 'error';
  data?: JobProgress;
  message?: string;
}

export interface LeadRegistrationResponse {
  jobId: string;
  status: 'queued' | 'in-progress' | 'completed' | 'failed';
  message: string;
  subDomainName: string;
  progressUrl?: string;
  sseUrl?: string;
  organizationProgressUrl?: string;
}
