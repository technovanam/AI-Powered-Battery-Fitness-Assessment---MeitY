import { CalibrationData } from '../types/assessment';

export class CalibrationEngine {
  /**
   * Standard A4 dimensions in centimeters
   */
  private static A4_WIDTH_CM = 21.0;
  private static A4_HEIGHT_CM = 29.7;

  /**
   * Processes frame metadata or keypoints to calibrate spatial scale (pixels to cm)
   * @param frameWidth Width of camera frame in pixels
   * @param frameHeight Height of camera frame in pixels
   * @param simulateMarkerFound Force simulate fiducial marker lock for demo
   */
  public static processFrameCalibration(
    frameWidth: number = 720,
    frameHeight: number = 1280,
    simulateMarkerFound: boolean = true
  ): CalibrationData {
    if (simulateMarkerFound) {
      // Marker detected in frame (e.g. 145px x 205px at 2 meters)
      const markerPixelHeight = 205; 
      const pxToCmRatio = markerPixelHeight / this.A4_HEIGHT_CM; // ~6.9px per cm

      return {
        isLocked: true,
        pxToCmRatio,
        confidenceScore: 98,
        method: 'aruco_marker',
        markerBounds: {
          x: frameWidth * 0.15,
          y: frameHeight * 0.65,
          width: 145,
          height: 205
        }
      };
    } else {
      // Anthropometric Fallback (e.g., estimating scale based on average adult shin/forearm keypoint ratio)
      const estimatedPxToCm = 5.8; // Fallback heuristic

      return {
        isLocked: false,
        pxToCmRatio: estimatedPxToCm,
        confidenceScore: 68,
        method: 'anthropometric_fallback',
        warningMessage: 'A4 Calibration Marker missing. Using lower-confidence anthropometric fallback.'
      };
    }
  }

  /**
   * Converts pixel distance on ground or wall to physical centimeters
   */
  public static convertPixelsToCm(pixelDistance: number, calibration: CalibrationData): number {
    if (!calibration.pxToCmRatio || calibration.pxToCmRatio <= 0) {
      return 0;
    }
    return Math.round((pixelDistance / calibration.pxToCmRatio) * 10) / 10;
  }
}
