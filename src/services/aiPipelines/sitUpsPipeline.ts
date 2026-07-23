export type SitUpState = 'DOWN' | 'RISING' | 'UP' | 'RETURNING';

export interface SitUpsAnalysisResult {
  validReps: number;
  invalidReps: number;
  confidence: number;
  currentState: SitUpState;
  currentTorsoAngle: number;
  faultReason?: string;
}

export class SitUpsPipeline {
  private validCount: number = 0;
  private invalidCount: number = 0;
  private state: SitUpState = 'DOWN';

  /**
   * Evaluates torso-hip-knee joint angle frame by frame
   * @param torsoAngle Angle between shoulder, hip, and knee (degrees)
   * @param isHandsClasped Whether wrist-neck keypoint distance remains within clasped threshold
   */
  public processFrame(torsoAngle: number, isHandsClasped: boolean = true): SitUpsAnalysisResult {
    let faultReason: string | undefined = undefined;

    if (!isHandsClasped) {
      faultReason = 'Fault: Hands unclasped from neck';
    }

    if (this.state === 'DOWN' && torsoAngle < 130) {
      this.state = 'RISING';
    } else if (this.state === 'RISING' && torsoAngle <= 60) {
      if (isHandsClasped) {
        this.state = 'UP';
        this.validCount += 1;
      } else {
        this.invalidCount += 1;
      }
    } else if (this.state === 'UP' && torsoAngle > 100) {
      this.state = 'RETURNING';
    } else if (this.state === 'RETURNING' && torsoAngle >= 150) {
      this.state = 'DOWN';
    }

    return {
      validReps: this.validCount,
      invalidReps: this.invalidCount,
      confidence: 93,
      currentState: this.state,
      currentTorsoAngle: Math.round(torsoAngle),
      faultReason
    };
  }

  public reset() {
    this.validCount = 0;
    this.invalidCount = 0;
    this.state = 'DOWN';
  }
}
