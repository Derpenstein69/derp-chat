import React from "react";

/**
 * ErrorBoundary component to catch and handle errors in the component tree.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components.
 * 
 * @returns {JSX.Element} The rendered error boundary component.
 * 
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, errorMessage: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // Implement a logging mechanism to log errors to an external logging service
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong. Please try again later.</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.errorMessage}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
