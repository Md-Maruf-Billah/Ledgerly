import React from 'react';

/**
 * [Security] Catches unhandled render errors and shows a safe fallback.
 * Without this, React crashes expose raw error stack traces in the browser.
 *
 * Wrap the root <App /> with this component in main.jsx.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production replace console.error with a real error reporting service
    // (e.g. Sentry) so you have visibility without exposing details to users.
    console.error('[Ledgerly] Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <div className="error-boundary-card">
            <img className="error-brand-mark" src="/logo-mark.svg" width="56" height="56" alt="" />
            <h2>Something went wrong</h2>
            <p>
              An unexpected error occurred. Your data is safe. Please refresh
              the page to continue.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
