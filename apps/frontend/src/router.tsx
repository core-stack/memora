import { BrowserRouter, Route, Routes } from 'react-router';

import Knowledge from './pages/[knowledge_slug]/page';
import Source from './pages/[knowledge_slug]/source/page';
import Home from './pages/page';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/:knowledge_slug" element={ <Knowledge /> }>
          <Route path='data' element={ <Source /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}