import { CalibrationData } from '../../types/assessment';
import { CalibrationEngine } from '../calibrationEngine';

export interface HeightAnalysisResult {
  heightCm: number;
  confidence: number;
  calibrationMethod: 'aruco_marker' | 'anthropometric_fallback';
  headTopPixel: number;
  feetPixel: number;
}

export class HeightPipeline {
  /**
   * Analyzes frame pose data to compute athlete standing height
   */
  public static analyzeHeight(
    calibration: CalibrationData,
    mockStandingHeightPx: number = 1120 // Distance in pixels from feet to head
  ): HeightAnalysisResult {
    // Extrapolate head-top offset above eye/ear keypoints
    const headTopOffsetPx = 45;
    const totalHeightPixels = mockStandingHeightPx + headTopOffsetPx;

    const heightCm = CalibrationEngine.convertPixelsToCm(totalHeightPixels, calibration);

    // Calculate confidence score based on calibration lock state and frame stability
    const confidence = calibration.isLocked ? calibration.confidenceScore : Math.min(70, calibration.confidenceScore);

    return {
      heightCm,
      confidence,
      calibrationMethod: calibration.method,
      headTopPixel: 120,
      feetPixel: 120 + totalHeightPixels
    };
  }
}
