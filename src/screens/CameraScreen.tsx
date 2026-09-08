import { lazy, Suspense } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { EmptyState } from '../components/EmptyState';
import { PermissionGate } from '../components/PermissionGate';
import { useAppCameraPermission } from '../hooks/useAppCameraPermission';

const LiveCameraView = lazy(() => import('./LiveCameraView'));

export function CameraScreen() {
  const { ready, hasPermission, canRequestPermission, requestPermission } =
    useAppCameraPermission();

  if (!ready) {
    return (
      <EmptyState
        title="Face Detection"
        message="Checking camera permission…"
      />
    );
  }

  if (!hasPermission) {
    return (
      <PermissionGate
        canRequestPermission={canRequestPermission}
        onRequestPermission={() => {
          void requestPermission();
        }}
        onOpenSettings={() => {
          void Linking.openSettings();
        }}
      />
    );
  }

  return (
    <View style={styles.root}>
      <ErrorBoundary>
        <Suspense
          fallback={
            <EmptyState title="Face Detection" message="Starting camera…" />
          }>
          <LiveCameraView />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
});
