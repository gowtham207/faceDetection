import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

type PermissionState = {
  ready: boolean;
  hasPermission: boolean;
  canRequestPermission: boolean;
  requestPermission: () => Promise<boolean>;
};

export function useAppCameraPermission(): PermissionState {
  const [ready, setReady] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [canRequestPermission, setCanRequestPermission] = useState(true);

  const refresh = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setHasPermission(false);
      setCanRequestPermission(true);
      setReady(true);
      return;
    }

    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    setHasPermission(granted);
    setCanRequestPermission(true);
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const requestPermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return false;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera access',
        message: 'FaceDetectionApp needs the camera to detect faces.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    const granted = result === PermissionsAndroid.RESULTS.GRANTED;
    setHasPermission(granted);
    setCanRequestPermission(result !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN);
    return granted;
  }, []);

  return {
    ready,
    hasPermission,
    canRequestPermission,
    requestPermission,
  };
}
