import { QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Helper function for API requests
export const apiRequest = async (
  method: string,
  endpoint: string,
  data?: any,
  token?: string | null
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Get auth token from localStorage if not provided
  const authToken = token || localStorage.getItem("token");
  if (authToken) {
    headers["x-auth-token"] = authToken;
    console.log("Using auth token in request:", authToken);
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(data);
  }

  // Get the server URL from the current window location
  const serverUrl = window.location.origin;
  
  const url = `${serverUrl}${endpoint}`;
  console.log(`Making API request to: ${url}`);

  return fetch(url, config);
};