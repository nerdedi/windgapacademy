import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="main" tabIndex={-1} className="p-8">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p>We&apos;re sorry — an unexpected error occurred. Please try again later.</p>
          <details className="mt-4 p-2 bg-gray-50 text-sm text-gray-700">
            <summary>Technical details</summary>
            <pre>{String(this.state.error)}</pre>
          </details>
        </main>
      );
    }

    return this.props.children;
  }
}
