import { useQueryClient } from '@tanstack/react-query';

export const useApiInvalidate = () => {
  const queryClient = useQueryClient();
  return async (...keys: readonly any[]): Promise<void> => {
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => queryClient.invalidateQueries(key)));
    } else {
      queryClient.clear();
    }
  }
}