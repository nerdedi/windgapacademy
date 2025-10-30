import React from "react";
import PropTypes from "prop-types";

/**
 * ErrorBoundary component to catch and handle Three.js/Canvas errors
 * Prevents entire app crashes when 3D rendering fails
 */
class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error("Three.js/Canvas Error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">3D Visualization Unavailable</h3>
            <p className="text-gray-600 mb-4">
              The 3D visualization couldn't be loaded. This might be due to your browser settings or
              device capabilities.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="btn btn-primary"
            >
              Try Again
            </button>
            {this.props.showDetails && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ThreeErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  onError: PropTypes.func,
  showDetails: PropTypes.bool,
};

ThreeErrorBoundary.defaultProps = {
  fallback: null,
  onError: null,
  showDetails: false,
};

export default ThreeErrorBoundary;
