import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";

interface RenderFallbackProps<ErrorType extends Error = Error> {
  error: ErrorType | null;
  reset: (...args: unknown[]) => void;
}

type RenderFallbackType = <ErrorType extends Error>(
  props: RenderFallbackProps<ErrorType>,
) => ReactNode;

interface ErrorBoundaryState {
  error: RenderFallbackProps["error"];
}

interface ErrorBoundaryProps {
  renderFallback: RenderFallbackType;
  resetKeys?: unknown[];
}

class CustomErrorBoundary extends Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.log("getDerivedStateFromError", error);
    return { error };
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { error } = this.state;
    if (error == null) {
      return;
    }

    const { resetKeys } = this.props;
    if (prevProps?.resetKeys !== resetKeys) {
      this.resetErrorBoundary();
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("componentDidCatch", { error, errorInfo });
  }

  resetErrorBoundary() {
    this.setState({ error: null });
  }

  render() {
    const { children, renderFallback } = this.props;
    const { error } = this.state;

    if (error) {
      return renderFallback({ error, reset: this.resetErrorBoundary });
    }

    return children;
  }
}

export default CustomErrorBoundary;
