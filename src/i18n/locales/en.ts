export const en = {
  player: {
    loading: 'Loading...',
    retrying: 'Retrying...',
    failed: 'Loading Failed',
    offline: 'No Network Connection',
    retry: 'Reload',
    showDetails: 'Show Details',
    hideDetails: 'Hide Details',
    errorTypes: {
      network: 'Network Error',
      format: 'Format Not Supported',
      decode: 'Audio Decode Error',
      aborted: 'Loading Cancelled',
      unknown: 'Unknown Error'
    },
    errorDetails: {
      network: 'Please check your network connection and try again',
      format: 'Current browser does not support this audio format or the source is invalid',
      decode: 'Audio file might be corrupted or format is not supported',
      aborted: 'Audio loading was interrupted by user or system',
      unknown: 'An unknown error occurred'
    },
    retryCount: 'Retry Count: {count}/{max}',
    solutions: {
      title: 'Please try the following solutions:',
      checkNetwork: '1. Check network connection',
      refresh: '2. Refresh the page',
      browser: '3. Try a different browser',
      cache: '4. Clear browser cache'
    },
    technical: {
      errorType: 'Error Type',
      errorCode: 'Error Code',
      details: 'Details',
      source: 'Current Source',
      format: 'Current Format'
    }
  }
}; 