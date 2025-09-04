import { useParams as useRouterParams } from 'react-router';

export const useParams = <T extends Record<string, string | undefined> = Record<string, string | undefined>>() => {
  return useRouterParams<T>();
}