/**
 * Types alignés strictement sur les serializers Django REST Framework
 * du backend Messar (accounts, core, projects, workflow, operations).
 * Aucun champ n'est inventé : chaque type reflète un serializer réel.
 */

// ---------- accounts ----------
export type UserRole = "INVESTOR" | "ADMIN" | "INSPECTOR";

// ---------- core ----------
export interface Requirement {
  id: number;
  name: string;
  required: boolean;
}

export interface ServiceType {
  id: number;
  name: string;
  required_inspections_count: number;
  provisional_validity_days: number;
  requirements: Requirement[];
}

// ---------- projects ----------
export type InvestorType = "PERSON" | "LOCAL_COMPANY" | "FOREIGN_COMPANY";

export interface Investor {
  id: number;
  type: InvestorType;
  full_name: string;
  nationality: string;
  national_id: string;
}

export interface Project {
  id: number;
  service_type: number;
  name: string;
  status: string;
  wilaya: string;
  moughataa: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export type NameReservationStatus =
  | "RESERVED"
  | "CONFIRMED"
  | "REGISTERED"
  | "EXPIRED";

export interface NameReservation {
  id: number;
  name: string;
  service_type: number;
  status: NameReservationStatus;
  expires_at: string;
  created_at: string;
}

export interface CheckNameResult {
  name: string;
  service_type: string;
  available: boolean;
}

export interface OnboardingPayload {
  email: string;
  phone: string;
  password: string;
  investor_type: InvestorType;
  full_name: string;
  nationality: string;
  national_id: string;
  project_name: string;
  service_type: number;
}

// ---------- workflow ----------
export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "NEEDS_CORRECTION"
  | "INSPECTION_SCHEDULED"
  | "INSPECTION_DONE"
  | "PAYMENT_PENDING"
  | "PAYMENT_VERIFIED"
  | "PROVISIONAL_LICENSE"
  | "FOLLOWUP_INSPECTIONS"
  | "FINAL_LICENSE"
  | "REJECTED";

export interface StatusHistoryEntry {
  from_status: string;
  to_status: string;
  to_status_display: string;
  note: string;
  created_at: string;
}

export interface ApplicationStatusResponse {
  id: number;
  status: ApplicationStatus;
  status_display: string;
  completed_inspections_count: number;
  required_inspections_count: number;
  rejection_reason: string;
  submitted_at: string | null;
  updated_at: string;
  history: StatusHistoryEntry[];
  progress_percentage: number;
}

export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface DocumentUploadPayload {
  project: number;
  requirement: number;
  file: File;
}

export interface DocumentRecord {
  id: number;
  project: number;
  requirement: number;
  file: string;
  status: DocumentStatus;
  rejection_reason: string;
  uploaded_at: string;
}

// ---------- operations ----------
export interface PaymentUploadPayload {
  project: number;
  amount: number;
  receipt: File;
}

export interface PaymentRecord {
  id: number;
  project: number;
  amount: string;
  receipt: string;
  status: string;
  created_at: string;
}

export type LicenseType = "INITIAL" | "FINAL";

export interface LicenseRecord {
  id: number;
  project: number;
  type: LicenseType;
  type_display: string;
  license_number: string;
  issued_at: string;
  expires_at: string;
}

export interface PublicLicenseVerification {
  valid: boolean;
  detail?: string;
  license_number?: string;
  type?: string;
  project_name?: string;
  service_type?: string;
  issued_at?: string;
  expires_at?: string;
}

export type InspectionResult = "PASSED" | "FAILED";

export interface InspectionRecord {
  id: number;
  project: number;
  inspector: number | null;
  status: string;
  result: InspectionResult | null;
  notes: string;
  latitude: number | null;
  longitude: number | null;
  checklist_completed: boolean;
  photo: string | null;
  created_at: string;
}

export interface InspectionReportPayload {
  result: InspectionResult;
  notes?: string;
  latitude: number;
  longitude: number;
  checklist_completed: boolean;
  photo?: File | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ---------- auth ----------
export interface LoginPayload {
  username: string; // le backend authentifie par "username" (= email saisi à l'inscription)
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

/** Contexte investisseur conservé côté client après l'inscription (aucun endpoint "me" n'existe côté backend). */
export interface LocalProjectContext {
  projectId: number;
  projectName: string;
  serviceTypeId: number;
  serviceTypeName: string;
}
