export interface JumpAnalysisResult {
  jumpHeightCm: number;
  flightTimeSeconds: number;
  takeoffFrame: number;
  landingFrame: number;
  confidence: number;
  fps: number;
  attempts: number[];
}

export class JumpPipeline {
  private static G_CONSTANT = 981; // cm/s^2

  /**
   * Calculates vertical jump height using flight-time physics: h = (g * t^2) / 8
   * @param takeoffFrame Frame number when ankles leave ground
   * @param landingFrame Frame number when ankles touch ground upon landing
   * @param fps Video frame rate (default 30fps)
   */
  public static analyzeJump(
    takeoffFrame: number = 32,
    landingFrame: number = 49,
    fps: number = 30
  ): JumpAnalysisResult {
    const totalFrames = Math.max(1, landingFrame - takeoffFrame);
    const flightTimeSeconds = totalFrames / fps;

    // h = g * t^2 / 8
    const jumpHeightCm = Math.round(((this.G_CONSTANT * Math.pow(flightTimeSeconds, 2)) / 8) * 10) / 10;

    // Frame-rate sensitivity confidence adjustment (as noted in blueprint spec section 4.2)
    const confidence = fps >= 60 ? 95 : 88;

    return {
      jumpHeightCm,
      flightTimeSeconds: Math.round(flightTimeSeconds * 1000) / 1000,
      takeoffFrame,
      landingFrame,
      confidence,
      fps,
      attempts: [jumpHeightCm, Math.max(10, jumpHeightCm - 3)]
    };
  }
}
