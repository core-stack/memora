import { useQueryClient } from '@tanstack/react-query';

export const useApiInvalidate = () => {
  const queryClient = useQueryClient();
  return (...queryKey: string[]) => queryClient.invalidateQueries({ queryKey: queryKey });
}