// import { useAuthToken } from "./useAuthToken";
// import { useEffect, useState } from "react";
// import { useCallback } from "react";


// export const useApi = () => {
//   const getToken = useAuthToken();
//   const [isTokenReady, setTokenReady] = useState(false);
//   const [loading, setLoading] = useState(true); // Track loading state
//   const [error, setError] = useState<string | null>(null); // Track errors

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         // Attempt to acquire a token when MSAL is ready
//         await getToken();

//         setTokenReady(true); // Mark the token as ready
//         console.log("Token successfully acquired.");
//       } catch (error) {
//         console.error("Error while initializing the token:", error);
//         setTokenReady(false); // Ensure token readiness is false if error occurs
//         setError("Error acquiring token.");
//       } finally {
//         setLoading(false); // Stop loading once token check is complete
//       }
//     };

//     checkToken();
//   }, [getToken]);

//   const callApi = useCallback(async (url: string, options: RequestInit = {}) => {
//     if (!isTokenReady) {
//       console.error("MSAL is not ready. Please try again later.");
//       return;
//     }

//     try {
//       const token = await getToken();

//       // Ensure token is a string before calling the API
//       if (typeof token !== "string") {
//         throw new Error("Invalid token.");
//       }

//       console.log("Token acquired, calling API...");
//       const data = await fetchApi(url, token, options);
//       if (!data) {
//         throw new Error("No data received from API");
//       }
//       console.log("API response received:", data);
//       return data;
//     } catch (error) {
//       console.error("Error calling API:", error);
//       setError("Error calling API.");
//       throw error;
//     }
//   }, [getToken, isTokenReady]);

//   return { callApi, loading, error };
// };

export {};
