import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Router } from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
