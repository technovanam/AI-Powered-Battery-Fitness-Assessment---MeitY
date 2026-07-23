import { CalibrationData } from '../../types/assessment';
import { CalibrationEngine } from '../calibrationEngine';

export interface BroadJumpAnalysisResult {
  distanceCm: number;
  confidence: number;
  takeoffPx: number;
  landingHeelPx: number;
  calibrationMethod: 'aruco_marker' | 'anthropometric_fallback';
}

export class BroadJumpPipeline {
  /**
   * Analyzes ground plane jump distance using homography scale transformation
   */
  public static analyzeBroadJump(
    calibration: CalibrationData,
    mockJumpDistancePx: number = 780 // Pixel distance along ground plane
  ): BroadJumpAnalysisResult {
    const distanceCm = CalibrationEngine.convertPixelsToCm(mockJumpDistancePx, calibration);
    
    // Homography confidence factor
    const confidence = calibration.isLocked ? 94 : 65;

    return {
      distanceCm,
      confidence,
      takeoffPx: 100,
      landingHeelPx: 100 + mockJumpDistancePx,
      calibrationMethod: calibration.method
    };
  }
}
