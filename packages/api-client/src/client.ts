let BASE_URL = `http://localhost:3000`;

export const setBaseUrl = (url: string) => {
  BASE_URL = url;
};

export const apiClient = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // 1. Set a default fallback message
    let errorMessage = `API Request failed: ${response.status} ${response.statusText}`;

    // 2. Safely try to extract your backend's custom JSON message
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message; // Overwrite the generic error with your custom one!
      }
    } catch (e) {
      // If the backend panicked and sent raw HTML instead of JSON (like a 502 Bad Gateway),
      // we just silently catch the parse error and stick to the default message.
    }

    // 3. Throw the clean error so your Discord bot can read it easily
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};
