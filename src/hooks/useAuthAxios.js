/**
 * src/hooks/useAuthAxios.js
 *
 * Reusable hook that provides the pre-configured axios instance.
 * Components and actions can import this hook to get an axios instance
 * that automatically handles auth tokens and refresh logic.
 *
 * Usage in a component:
 *   const api = useAuthAxios();
 *   const data = await api.get('/api/workspaces');
 */
import { useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useAuthAxios = () => {
  // Memoize so we don't recreate on every render
  return useMemo(() => axiosInstance, []);
};

export default useAuthAxios;
