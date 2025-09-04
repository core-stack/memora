import { useNavigate } from 'react-router';

export const useRouter = () => {
  return {
    push: (url: string) => useNavigate()(url),
    replace: (url: string) => useNavigate()(url, { replace: true }),
    back: () => useNavigate()(-1),
    forward: () => useNavigate()(1),
  }
}