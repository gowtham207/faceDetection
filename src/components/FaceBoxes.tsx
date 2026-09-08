import { StyleSheet, Text, View } from 'react-native';
import type { PreviewFaceBox, PreviewPoint } from '../utils/mapFacesToPreview';

type FaceBoxesProps = {
  boxes: PreviewFaceBox[];
};

const EYE_DOT = 14;

function EyeDistanceLine({
  left,
  right,
  distancePx,
  distanceCm,
}: {
  left: PreviewPoint;
  right: PreviewPoint;
  distancePx: number;
  distanceCm: number;
}) {
  const angleDeg = (Math.atan2(right.y - left.y, right.x - left.x) * 180) / Math.PI;
  const midX = (left.x + right.x) / 2;
  const midY = (left.y + right.y) / 2;

  return (
    <>
      <View
        style={[
          styles.eyeLine,
          {
            left: midX - distancePx / 2,
            top: midY - 1,
            width: distancePx,
            transform: [{ rotate: `${angleDeg}deg` }],
          },
        ]}
      />
      <Text
        style={[
          styles.distanceLabel,
          {
            left: midX - 48,
            top: midY - 22,
          },
        ]}>
        {`${distanceCm.toFixed(1)} cm`}
      </Text>
    </>
  );
}

function EyeMarker({
  point,
  label,
}: {
  point: PreviewPoint;
  label: string;
}) {
  return (
    <View
      style={[
        styles.eyeWrap,
        {
          left: point.x - EYE_DOT / 2,
          top: point.y - EYE_DOT / 2,
        },
      ]}>
      <View style={styles.eyeDot} />
      <Text style={styles.eyeLabel}>{label}</Text>
    </View>
  );
}

export function FaceBoxes({ boxes }: FaceBoxesProps) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {boxes.map((box, index) => (
        <View key={box.trackingId ?? `${Math.round(box.x)}-${Math.round(box.y)}-${index}`}>
          <View
            style={[
              styles.box,
              {
                left: box.x,
                top: box.y,
                width: box.width,
                height: box.height,
              },
            ]}
          />
          <EyeMarker point={box.leftEye} label="L" />
          <EyeMarker point={box.rightEye} label="R" />
          <EyeDistanceLine
            left={box.leftEye}
            right={box.rightEye}
            distancePx={box.eyeDistancePx}
            distanceCm={box.eyeDistanceCm}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4ADE80',
    borderRadius: 8,
  },
  eyeWrap: {
    position: 'absolute',
    width: EYE_DOT,
    height: EYE_DOT,
    alignItems: 'center',
  },
  eyeDot: {
    width: EYE_DOT,
    height: EYE_DOT,
    borderRadius: EYE_DOT / 2,
    backgroundColor: '#38BDF8',
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  eyeLabel: {
    marginTop: 2,
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  eyeLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#FDE68A',
  },
  distanceLabel: {
    position: 'absolute',
    width: 96,
    textAlign: 'center',
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
