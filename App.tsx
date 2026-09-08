import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CameraScreen } from './src/screens/CameraScreen';

function App() {
  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar barStyle="light-content" />
      <CameraScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
