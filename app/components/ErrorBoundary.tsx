'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-red-100">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-6xl">😕</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                Oops! Something went wrong
              </h1>

              {/* Message */}
              <p className="text-center text-gray-600 mb-6">
                We encountered an unexpected error while loading this page. Don&apos;t worry — your
                progress is safe!
              </p>

              {/* Error Details (dev mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="font-mono text-sm text-red-800 break-words">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined });
                    window.location.reload();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined });
                    window.location.href = '/';
                  }}
                  className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
                >
                  Return Home
                </button>
              </div>

              {/* Support Message */}
              <p className="text-center text-sm text-gray-500 mt-6">
                If this problem persists, please try clearing your browser cache or contact support.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-2 mt-6">
              <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
