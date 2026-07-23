import { create } from 'zustand';
import { Athlete, AssessmentMode, TestId, TestResult, SyncQueueItem } from '../types/assessment';

interface AssessmentState {
  mode: AssessmentMode;
  activeAthlete: Athlete | null;
  athletes: Athlete[];
  results: Record<string, TestResult[]>; // Keyed by athleteId
  syncQueue: SyncQueueItem[];
  
  // Actions
  setMode: (mode: AssessmentMode) => void;
  setActiveAthlete: (athlete: Athlete | null) => void;
  registerAthlete: (athleteData: Omit<Athlete, 'id' | 'createdAt'>) => Athlete;
  saveTestResult: (result: Omit<TestResult, 'id' | 'timestamp'>) => TestResult;
  getResultsForAthlete: (athleteId: string) => TestResult[];
  clearCurrentSession: () => void;
  syncQueueItem: (itemId: string) => void;
}

// Initial mock athlete for quick testing
const MOCK_DEFAULT_ATHLETE: Athlete = {
  id: 'ath-001',
  name: 'Aarav Sharma',
  age: 14,
  gender: 'M',
  category: '12+',
  apaarId: 'APAAR-9821-4410-7712',
  nsrsId: 'NSRS-IND-2026-089',
  schoolId: 'KV-DELHI-04',
  createdAt: new Date().toISOString()
};

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  mode: 'individual',
  activeAthlete: MOCK_DEFAULT_ATHLETE,
  athletes: [MOCK_DEFAULT_ATHLETE],
  results: {},
  syncQueue: [],

  setMode: (mode) => set({ mode }),

  setActiveAthlete: (athlete) => set({ activeAthlete: athlete }),

  registerAthlete: (athleteData) => {
    const newAthlete: Athlete = {
      ...athleteData,
      id: `ath-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      athletes: [...state.athletes, newAthlete],
      activeAthlete: newAthlete
    }));

    return newAthlete;
  },

  saveTestResult: (resultData) => {
    const newResult: TestResult = {
      ...resultData,
      id: `res-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    };

    const athleteId = resultData.athleteId;

    // Create sync queue item (De-identified numeric data only)
    const syncItem: SyncQueueItem = {
      id: `sync-${Date.now().toString().slice(-6)}`,
      testResultId: newResult.id,
      athleteId: athleteId,
      payload: newResult,
      status: 'PENDING',
      retries: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    set((state) => {
      const existingResults = state.results[athleteId] || [];
      // Replace previous attempt for same testId or append
      const filteredResults = existingResults.filter(r => r.testId !== resultData.testId);
      
      return {
        results: {
          ...state.results,
          [athleteId]: [...filteredResults, newResult]
        },
        syncQueue: [...state.syncQueue, syncItem]
      };
    });

    return newResult;
  },

  getResultsForAthlete: (athleteId) => {
    return get().results[athleteId] || [];
  },

  clearCurrentSession: () => {
    set({ activeAthlete: null });
  },

  syncQueueItem: (itemId) => {
    set((state) => ({
      syncQueue: state.syncQueue.map((item) =>
        item.id === itemId
          ? { ...item, status: 'SYNCED', updatedAt: new Date().toISOString() }
          : item
      )
    }));
  }
}));
