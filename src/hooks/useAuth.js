// src/hooks/useAuth.js
import { useState } from 'react';

function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      // Add your authentication logic here
      console.log('Logging in with:', { username, password });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}

export default useAuth;