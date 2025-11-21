import { useQueryClient } from '@tanstack/react-query';

export const useApiInvalidate = () => {
  const queryClient = useQueryClient();
  return (...keys: readonly any[]) => {
    if (keys.length > 0) {
      return Promise.all(keys.map((key) => queryClient.invalidateQueries(key)))
    } else {
      return queryClient.clear();
    }
  }
}