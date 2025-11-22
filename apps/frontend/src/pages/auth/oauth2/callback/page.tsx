import { AsyncBoundary } from '@/components/suspense-boundary';
import { useApiAuthOauth2Callback } from '@/gen';

export const OAuth2CallbackPage = () => {
  const { } = useApiAuthOauth2Callback();
  return (
    <AsyncBoundary>

    </AsyncBoundary>
  );
}