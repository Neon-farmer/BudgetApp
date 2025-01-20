/* 
FetchApi is a utility function used to make API requests. 
It handles the HTTP request and expects an authorization token 
as an argument to set the Authorization header for the request.
 */

export const fetchApi = async (
  url: string,
  token: string,
  options: RequestInit = {}
) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};
