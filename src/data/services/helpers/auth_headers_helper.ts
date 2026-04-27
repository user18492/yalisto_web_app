// Imports
// (no external imports required)

// Types
type AuthHeaders = {
  "Content-Type": "application/json";
  Authorization?: string;
};

// Constants
const AUTH_TOKEN_KEY: string = "auth_token";

// Functions
export const get_auth_headers = (): HeadersInit => {
  const token: string | null = localStorage.getItem(AUTH_TOKEN_KEY);

  const headers: AuthHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};
