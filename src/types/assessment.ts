export type TestId = 
  | 'height' 
  | 'weight' 
  | 'vertical_jump' 
  | 'broad_jump' 
  | 'sit_ups' 
  | 'sit_and_reach' 
  | 'medicine_ball' 
  | 'sprint_30m' 
  | 'shuttle_run' 
  | 'endurance_run';

export type AssessmentMode = 'individual' | 'assessor';

export type AgeCategory = 'U-12' | '12+';

export interface Athlete {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  category: AgeCategory;
  apaarId?: string;
  nsrsId?: string;
  schoolId?: string;
  createdAt: string;
}

export interface CalibrationData {
  isLocked: boolean;
  pxToCmRatio: number; // e.g. 2.45 pixels per cm
  confidenceScore: number; // 0 to 100%
  method: 'aruco_marker' | 'anthropometric_fallback';
  markerBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  warningMessage?: string;
}

export interface TestResult {
  id: string;
  testId: TestId;
  athleteId: string;
  score: number;
  unit: string;
  confidence: number; // 0 to 100%
  isAiMeasured: boolean;
  timestamp: string;
  calibrationMethod?: 'aruco_marker' | 'anthropometric_fallback' | 'none';
  faultFlag?: boolean;
  videoUri?: string; // App-private encrypted file path
  notes?: string;
  attempts?: number[];
}

export interface SyncQueueItem {
  id: string;
  testResultId: string;
  athleteId: string;
  payload: TestResult;
  status: 'PENDING' | 'UPLOADING' | 'SYNCED' | 'FAILED';
  retries: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestProtocolInfo {
  id: TestId;
  name: string;
  nameHindi: string;
  category: string;
  isAiSupported: boolean;
  unit: string;
  description: string;
  instructions: string[];
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
  targetRange?: { min: number; max: number };
}
