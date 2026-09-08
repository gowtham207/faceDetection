import type { DetectedFace, FaceRect } from '@noma4i/vision-camera-face-detector';

export type PreviewPoint = {
  x: number;
  y: number;
};

export type PreviewFaceBox = FaceRect & {
  trackingId?: number;
  leftEye: PreviewPoint;
  rightEye: PreviewPoint;
  eyeDistancePx: number;
  eyeDistanceCm: number;
};

/**
 * Typical frontal-face proportions inside an ML Kit bounding box.
 * The current VisionCamera plugin does not pass landmark coordinates to JS.
 */
const LEFT_EYE_X = 0.3;
const RIGHT_EYE_X = 0.7;
const EYE_Y = 0.38;

function pointInBox(box: FaceRect, nx: number, ny: number): PreviewPoint {
  return {
    x: box.x + box.width * nx,
    y: box.y + box.height * ny,
  };
}

export function distanceBetween(a: PreviewPoint, b: PreviewPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

const DP_PER_INCH = 160;
const CM_PER_INCH = 2.54;

/** Convert React Native layout pixels (dp) to on-screen centimeters. */
export function pixelsToCm(px: number): number {
  return (px / DP_PER_INCH) * CM_PER_INCH;
}

/**
 * Maps ML Kit / VisionCamera frame-space face bounds into preview coordinates.
 *
 * `useFaceDetector` only projects the primary face (`primaryFaceRect`). This
 * reuses that mapping (scale + origin) so every detected face can be drawn.
 */
export function mapDetectedFacesToPreview(
  faces: readonly DetectedFace[],
  primaryFace?: DetectedFace,
  primaryFaceRect?: FaceRect,
): PreviewFaceBox[] {
  if (faces.length === 0 || !primaryFace || !primaryFaceRect) {
    return [];
  }

  const { bounds } = primaryFace;
  if (bounds.width <= 0 || bounds.height <= 0) {
    return [];
  }

  const scaleX = primaryFaceRect.width / bounds.width;
  const scaleY = primaryFaceRect.height / bounds.height;
  const originX = primaryFaceRect.x - bounds.x * scaleX;
  const originY = primaryFaceRect.y - bounds.y * scaleY;

  return faces.map(face => {
    const box = {
      x: face.bounds.x * scaleX + originX,
      y: face.bounds.y * scaleY + originY,
      width: face.bounds.width * scaleX,
      height: face.bounds.height * scaleY,
    };
    const leftEye = pointInBox(box, LEFT_EYE_X, EYE_Y);
    const rightEye = pointInBox(box, RIGHT_EYE_X, EYE_Y);

    const eyeDistancePx = distanceBetween(leftEye, rightEye);

    return {
      ...box,
      trackingId: face.trackingId,
      leftEye,
      rightEye,
      eyeDistancePx,
      eyeDistanceCm: pixelsToCm(eyeDistancePx),
    };
  });
}
