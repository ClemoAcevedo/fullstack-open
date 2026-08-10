import { Alert } from '@mui/material'
import { Component } from 'react'

class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          Something went wrong. Please try again later.
        </Alert>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
