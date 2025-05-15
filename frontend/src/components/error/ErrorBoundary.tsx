import React, { Component, ErrorInfo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
          <div className="max-w-md w-full p-8 rounded-lg shadow-lg border-2 border-cyan-400" 
               style={{ 
                 background: "linear-gradient(135deg, #120338 0%, #000428 100%)",
                 boxShadow: "0 0 25px rgba(80, 255, 255, 0.5), 0 0 5px rgba(190, 100, 255, 0.3)" 
               }}>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-black p-4 mb-4 border border-purple-500" 
                   style={{ boxShadow: "0 0 15px rgba(160, 89, 255, 0.6)" }}>
                <AlertCircle className="h-10 w-10 text-cyan-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-cyan-300 mb-2"
                  style={{ textShadow: "0 0 8px rgba(80, 255, 255, 0.6)" }}>
               😟 Something Went Wrong !...
              </h2>
              
              <p className="text-purple-200 mb-6">
                An unexpected error occurred. We've detected an issue
                with this component that needs attention.
              </p>
              
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-cyan-400 hover:bg-cyan-900 text-cyan-300 font-medium py-2 px-6 rounded-md transition-colors duration-200"
                style={{ boxShadow: "0 0 10px rgba(80, 255, 255, 0.4)" }}
              >
                <RefreshCw className="h-5 w-5" />
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;