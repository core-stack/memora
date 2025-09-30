import { useLocation as useRouterLocation } from 'react-router';

export const useLocation = (): { pathname: string, search: string } => {
  return useRouterLocation();
}