import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CameraFacing } from '../types/face';

type CameraHudProps = {
  faceCount: number;
  facing: CameraFacing;
  detectorAvailable: boolean;
  eyeDistanceCm: number | null;
  onFlipCamera: () => void;
};

export function CameraHud({
  faceCount,
  facing,
  detectorAvailable,
  eyeDistanceCm,
  onFlipCamera,
}: CameraHudProps) {
  const insets = useSafeAreaInsets();
  const eyeGap =
    eyeDistanceCm != null ? ` · ${eyeDistanceCm.toFixed(1)} cm apart` : '';
  const statusLabel = !detectorAvailable
    ? 'Detection unavailable'
    : faceCount === 0
      ? 'No face'
      : faceCount === 1
        ? `1 face${eyeGap}`
        : `${faceCount} faces${eyeGap}`;

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{statusLabel}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Flip camera"
        onPress={onFlipCamera}
        style={({ pressed }) => [styles.flipButton, pressed && styles.pressed]}>
        <Text style={styles.flipLabel}>
          {facing === 'front' ? 'Use back camera' : 'Use front camera'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  badge: {
    backgroundColor: '#1E293B',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  flipButton: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  flipLabel: {
    color: '#0B0F14',
    fontSize: 15,
    fontWeight: '700',
  },
});
