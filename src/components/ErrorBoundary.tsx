import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  children: ReactNode;
};

type State = {
  message: string | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { message: null };

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message || 'Something went wrong' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FaceDetectionApp error', error, info.componentStack);
  }

  render() {
    if (this.state.message) {
      return (
        <View style={styles.root}>
          <Text style={styles.title}>Could not start camera</Text>
          <Text style={styles.body}>{this.state.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
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
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    color: '#FCA5A5',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
});
