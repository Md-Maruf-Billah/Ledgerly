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
            <div className="brand-mark" aria-hidden="true">
              <div className="brand-grid"><span /><span /><span /><span /></div>
            </div>
            <h2>Something went wrong</h2>
            <p>
              An unexpected error occurred. Your data is safe — please refresh
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
