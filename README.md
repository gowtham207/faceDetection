# FaceDetectionApp

Live on-device face detection for React Native. The app opens the camera, finds faces with Google ML Kit (Android) / VisionCamera object output (iOS), and draws bounding boxes on the preview.

Detection runs on the device. No images are uploaded.

## Requirements

- Node.js 22.11 or newer
- Android Studio / SDK (this repo is set up as a bare React Native CLI app)
- A **physical Android device** is the most reliable way to test. Emulator cameras often have no real faces unless you attach a webcam.

iOS is configured (camera permission + iOS 15.5) but needs a Mac to build.

## Install

```sh
npm install
```

## Run

Start Metro, then build Android in another terminal:

```sh
npm start
npm run android
```

The first launch after installing native camera libraries **must be a full native rebuild**. Reloading Metro is not enough.

## What you should see

1. A camera permission screen. Grant access, or open Settings if Android no longer shows the prompt.
2. A live preview (front camera by default).
3. A green box around each detected face and a face-count badge.
4. A control to switch between front and back cameras.

If no camera hardware is available, the app shows a “No camera found” state.

## Project layout

```
App.tsx
src/
  screens/CameraScreen.tsx
  components/FaceBoxes.tsx
  components/CameraHud.tsx
  components/PermissionGate.tsx
  components/EmptyState.tsx
  utils/mapFacesToPreview.ts
```

## Troubleshooting

- **No boxes on a real face:** Use a physical device with good lighting. The emulator’s virtual camera often does not contain a detectable face.
- **Permission denied permanently:** Use **Open settings** and enable Camera for FaceDetectionApp.
- **Native build errors after pulling deps:** Delete `android/app/build` and run `npm run android` again.
