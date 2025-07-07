const baseUrl = import.meta.env.VITE_API_BASE_URL;

export interface LoginDTO {
  name?: string
  email: string;
  password: string;
}

// Custom hook for authentication
export const useAuth = () => {
  return async (data: LoginDTO) => {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return {
        error: false,
        data: result,
      };
    } catch (error: unknown) {
      return {
        error: true,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  };
};
