// Utility function to convert server errors to user-friendly messages
export const getUserFriendlyError = (error) => {
  // If it's a network error or no response
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return "Request timed out. Please try again."
    }
    if (error.message?.includes('Network Error')) {
      return "Unable to connect to the server. Please check your internet connection and try again."
    }
    return "Unable to connect to the server. Please check your internet connection and try again."
  }

  const status = error.response?.status
  const errorMessage = error.response?.data?.error || error.response?.data?.message

  // Handle different HTTP status codes
  switch (status) {
    case 400:
      return "Invalid request. Please check your input and try again."
    case 401:
      return "Invalid username or password. Please try again."
    case 403:
      return "You don't have permission to perform this action."
    case 404:
      return "The requested resource was not found."
    case 409:
      return "This username is already taken. Please choose another one."
    case 422:
      return "Invalid data provided. Please check your input."
    case 429:
      return "Too many requests. Please wait a moment and try again."
    case 500:
    case 502:
    case 503:
      return "Server error. Please try again later."
    default:
      // If there's a specific user-friendly message from the server, use it
      if (errorMessage) {
        // Check if it's already user-friendly (doesn't contain technical details)
        const isTechnical = errorMessage.includes('Error:') || 
                           errorMessage.includes('at ') || 
                           errorMessage.includes('stack') ||
                           errorMessage.includes('MongoError') ||
                           errorMessage.includes('CastError') ||
                           errorMessage.includes('ValidationError')
        
        if (!isTechnical) {
          return errorMessage
        }
      }
      return "Something went wrong. Please try again."
  }
}

