import { BrowserRouter, Route, Routes } from 'react-router';

import Knowledge from './pages/[knowledge_slug]/page';
import Source from './pages/[knowledge_slug]/source/page';
import Home from './pages/page';
import { RootProviders } from './root-providers';

export const Router = () => {
  return (
    <BrowserRouter>
      <RootProviders>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/:knowledge_slug" element={ <Knowledge /> }>
            <Route path='source' element={ <Source /> } />
          </Route>
        </Routes>
      </RootProviders>
    </BrowserRouter>
  )
}