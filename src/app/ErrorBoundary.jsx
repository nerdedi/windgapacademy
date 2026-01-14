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
    console.error("Uncaught error:", error, info);
  }

  handleReload = () => {
    try {
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.href = window.location.origin;
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          role="main"
          tabIndex={-1}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5ED1D2] to-[#A32C2B] p-8"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-[#A32C2B] mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try reloading the page.
            </p>
            <details className="text-left mb-6 p-3 bg-gray-50 rounded-lg text-sm">
              <summary className="cursor-pointer font-medium text-gray-700">
                Technical details
              </summary>
              <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap overflow-auto max-h-32">
                {String(this.state.error)}
              </pre>
            </details>
            <button
              onClick={this.handleReload}
              className="w-full bg-[#A32C2B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8a2424] transition-all"
            >
              🔄 Reload Page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
