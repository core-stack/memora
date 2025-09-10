import { BrowserRouter, Route, Routes } from "react-router";

import ChatPage from "./pages/[knowledge_slug]/chat/page";
import Knowledge from "./pages/[knowledge_slug]/page";
import Source from "./pages/[knowledge_slug]/source/page";
import { RootProviders } from "./root-providers";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <RootProviders /> }>
          {/* <Route path="/" element={ <Home /> } /> */}
          <Route path="/:knowledge_slug" element={ <Knowledge /> }>
            <Route path='chat' element={ <ChatPage /> } />
            <Route path='source' element={ <Source /> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}