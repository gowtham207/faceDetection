import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  View,
  type AppStateStatus,
  type LayoutChangeEvent,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera';
import { useFaceDetector } from '@noma4i/vision-camera-face-detector';
import { CameraHud } from '../components/CameraHud';
import { EmptyState } from '../components/EmptyState';
import { FaceBoxes } from '../components/FaceBoxes';
import type { CameraFacing, PreviewSize } from '../types/face';
import { mapDetectedFacesToPreview } from '../utils/mapFacesToPreview';

function asAppState(value: string | null | undefined): AppStateStatus {
  switch (value) {
    case 'inactive':
    case 'background':
    case 'active':
    case 'extension':
    case 'unknown':
      return value;
    default:
      return 'active';
  }
}

function useIsAppActive() {
  const [appState, setAppState] = useState<AppStateStatus>(() =>
    asAppState(AppState.currentState),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      setAppState(asAppState(nextState));
    });
    return () => subscription.remove();
  }, []);

  return appState === 'active';
}

export function LiveCameraView() {
  const [facing, setFacing] = useState<CameraFacing>('front'); 
  const [previewSize, setPreviewSize] = useState<PreviewSize>({
    width: 0,
    height: 0,
  });
  const [cameraError, setCameraError] = useState<string | null>(null);
  const devices = useCameraDevices();
  const preferredDevice = useCameraDevice(facing);
  const fallbackDevice = useCameraDevice(facing === 'front' ? 'back' : 'front');
  const device = preferredDevice ?? fallbackDevice;
  const isAppActive = useIsAppActive();

  const face = useFaceDetector({
    preset: 'fast',
    guide: 'none',
    preview:
      previewSize.width > 0 && previewSize.height > 0
        ? previewSize
        : undefined,
    android: {
      enableTracking: true,
    },
  });

  const boxes = useMemo(
    () =>
      mapDetectedFacesToPreview(
        face.result.faces,
        face.result.primaryFace,
        face.result.primaryFaceRect,
      ),
    [face.result.faces, face.result.primaryFace, face.result.primaryFaceRect],
  );

  const eyeDistanceCm = useMemo(() => {
    if (boxes.length === 0) {
      return null;
    }

    return boxes.reduce((largest, box) =>
      box.width * box.height > largest.width * largest.height ? box : largest,
    ).eyeDistanceCm;
  }, [boxes]);

  const onPreviewLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPreviewSize(current =>
      current.width === width && current.height === height
        ? current
        : { width, height },
    );
  }, []);

  const onFlipCamera = useCallback(() => {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
    setCameraError(null);
  }, []);

  if (!device) {
    return (
      <EmptyState
        title={devices.length === 0 ? 'Looking for camera…' : 'No camera found'}
        message={
          devices.length === 0
            ? 'Waiting for the device camera to become available.'
            : 'Connect or enable a camera, then reopen the app.'
        }
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.preview} onLayout={onPreviewLayout}>
        <Camera
          {...face.camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isAppActive}
          mirrorMode="auto"
          resizeMode="cover"
          implementationMode="compatible"
          onError={error => {
            setCameraError(error.message);
          }}
        />
        <FaceBoxes boxes={boxes} />
      </View>
      <CameraHud
        faceCount={face.result.faces.length}
        facing={preferredDevice ? facing : facing === 'front' ? 'back' : 'front'}
        detectorAvailable={face.available}
        eyeDistanceCm={eyeDistanceCm}
        onFlipCamera={onFlipCamera}
      />
      {cameraError ? (
        <View style={styles.errorBanner} pointerEvents="none">
          <Text style={styles.errorText}>{cameraError}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
  preview: {
    flex: 1,
    backgroundColor: '#111827',
    overflow: 'hidden',
  },
  errorBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    backgroundColor: 'rgba(127, 29, 29, 0.92)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    color: '#FEE2E2',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default LiveCameraView;
