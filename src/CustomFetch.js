 export async function customFetch(url, options = {}) {
    const token = localStorage.getItem('accessToken'); // Retrieve your token from local storage

    // Set up default headers
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };

    // If a token is available, add it to the Authorization header
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Merge with any headers provided in options
    options.headers = {...defaultHeaders, ...options.headers};

    try {
      return await fetch(url, options);
    } catch (error) {
      console.error('Error in fetch:', error);
      throw error;
    }
  }
