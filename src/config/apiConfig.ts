// Ensure the API URL is always absolute
const getApiBaseUrl = (): string => {
  let apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:7083";
  
  // If the URL doesn't start with http:// or https://, add https://
  if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    apiUrl = `https://${apiUrl}`;
  }
  
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, '');
};

export const API_BASE_URL = getApiBaseUrl();

console.log('API_BASE_URL configured as:', API_BASE_URL); // Debug log
        