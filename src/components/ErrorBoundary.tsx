import {Component, ErrorInfo, ReactElement} from "react";

class ErrorBoundary extends Component<{children: ReactElement}> {
  state = {hasError: false};
  static getDerivedStateFromError() {
    return {hasError: true};
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div className="error">Oops! Something went wrong.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
