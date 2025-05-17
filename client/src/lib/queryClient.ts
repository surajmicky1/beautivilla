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
    console.log(`Request body: ${config.body}`);
  }

  // Add server URL to ensure proper API endpoint resolution
  const isAbsoluteUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://');
  const baseUrl = isAbsoluteUrl ? '' : 'http://localhost:5000'; // Set the correct backend URL
  const url = isAbsoluteUrl ? endpoint : `${baseUrl}${endpoint}`;
  
  console.log(`Making API request to: ${url} with method: ${method}`);
  console.log(`Request config:`, config);

  try {
    const response = await fetch(url, config);
    console.log(`Response status: ${response.status}`);
    
    // Try to parse the response as JSON for debugging
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const clonedResponse = response.clone();
      const responseData = await clonedResponse.json();
      console.log('Response data:', responseData);
    }
    
    return response;
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    throw error;
  }
};