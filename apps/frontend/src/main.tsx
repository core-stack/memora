import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { RootProviders } from './root-providers.tsx';
import { Router } from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootProviders>
      <Router />
    </RootProviders>
  </StrictMode>,
)
