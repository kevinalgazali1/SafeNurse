// Common types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'nurse' | 'doctor' | 'staff';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Patient types
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  address: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: MedicalRecord[];
  allergies: string[];
  currentMedications: Medication[];
  admissionDate?: Date;
  dischargeDate?: Date;
  roomNumber?: string;
  status: 'active' | 'discharged' | 'transferred';
  createdAt: Date;
  updatedAt: Date;
}

// Medical Record types
export interface MedicalRecord {
  id: string;
  patientId: string;
  date: Date;
  diagnosis: string;
  treatment: string;
  notes: string;
  doctorId: string;
  nurseId?: string;
  vitals?: VitalSigns;
  createdAt: Date;
  updatedAt: Date;
}

// Vital Signs types
export interface VitalSigns {
  temperature: number; // Celsius
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number; // BPM
  respiratoryRate: number; // per minute
  oxygenSaturation: number; // percentage
  weight?: number; // kg
  height?: number; // cm
  measuredAt: Date;
  measuredBy: string;
}

// Medication types
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'injection' | 'topical' | 'inhalation' | 'other';
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  notes?: string;
  status: 'active' | 'completed' | 'discontinued';
}

// Schedule types
export interface Schedule {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'medication' | 'checkup' | 'procedure' | 'appointment' | 'other';
  patientId?: string;
  assignedTo: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Report types
export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  dateRange: {
    start: Date;
    end: Date;
  };
  data: unknown; // This would be more specific based on report type
  generatedBy: string;
  generatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string | number;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Status types
export type Status = 'success' | 'error' | 'warning' | 'info';

// Size types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Variant types
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';