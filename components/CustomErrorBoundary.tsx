"use client"
import React from 'react';

export default class CustomErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with the editor.</div>;
    }
    return this.props.children;
  }
}