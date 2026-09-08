import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PermissionGateProps = {
  canRequestPermission: boolean;
  onRequestPermission: () => void;
  onOpenSettings: () => void;
};

export function PermissionGate({
  canRequestPermission,
  onRequestPermission,
  onOpenSettings,
}: PermissionGateProps) {
  const insets = useSafeAreaInsets();
  const actionLabel = canRequestPermission ? 'Allow camera' : 'Open settings';
  const onPress = canRequestPermission ? onRequestPermission : onOpenSettings;

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Text style={styles.title}>Camera access needed</Text>
      <Text style={styles.body}>
        FaceDetectionApp uses the camera to find faces in the live preview.
        Detection stays on this device.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonLabel}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    color: '#94A3B8',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
});
