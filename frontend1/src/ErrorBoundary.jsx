import React, { Component } from "react";

class ErrorBoundary extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error)
  {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo)
  {
    this.setState({ error, errorInfo });
    console.error("🚨 Error caught by ErrorBoundary:");
    console.error("Error object:", error);
    console.error("Error info (component stack):", errorInfo.componentStack);
  }

  render()
  {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-600">
          <h1>Something went wrong!</h1>
          <h2>Error: {this.state.error?.message}</h2>
          <pre>{this.state.errorInfo?.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
