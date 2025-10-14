import { OgOrganization, OgProduct } from "@/apiHooks.ts/organization/organization.types";

export interface JobProgress {
  jobId: string;
  organizationId: string;
  subDomainName: string;
  status: 'queued' | 'in-progress' | 'completed' | 'failed';
  currentStep: string;
  totalSteps: number;
  currentStepNumber: number;
  progress: number; // 0-100
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

export const LEAD_REGISTRATION_STEPS: LeadRegistrationStep[] = [
  { name: 'QUEUED', description: 'Job queued for processing', order: 0 },
  { name: 'CNAME_CREATION', description: 'Creating CNAME record', order: 1 },
  { name: 'SFTP_SETUP', description: 'Setting up SFTP connection', order: 2 },
  { name: 'ENV_UPDATE', description: 'Updating environment files', order: 3 },
  { name: 'DB_UPDATE', description: 'Updating database files', order: 4 },
  { name: 'DB_CONNECTION', description: 'Initializing database connection', order: 5 },
  { name: 'DB_CREATION', description: 'Creating database', order: 6 },
  { name: 'SSH_CONNECTION', description: 'Establishing SSH connection', order: 7 },
  { name: 'DB_SEEDING', description: 'Seeding database', order: 8 },
  { name: 'PACKAGE_UPDATE', description: 'Updating tenant package', order: 9 },
  { name: 'CREDENTIALS_UPDATE', description: 'Updating admin credentials', order: 10 },
  { name: 'LEAD_SAVE', description: 'Saving lead to database', order: 11 },
  { name: 'DATACENTER_UPDATE', description: 'Updating datacenter count', order: 12 },
  { name: 'EMAIL_SENDING', description: 'Sending registration email', order: 13 },
  // { name: 'COMPLETED', description: 'Registration completed successfully', order: 15 }
];

export const getStepDisplayName = (stepName: string): string => {
  const step = LEAD_REGISTRATION_STEPS.find(s => s.name === stepName);
  return step ? step.description : stepName;
};