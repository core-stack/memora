import { BrowserRouter, Route, Routes } from "react-router";

import ChatPage from "./pages/[knowledgeSlug]/chat/page";
import Knowledge from "./pages/[knowledgeSlug]/page";
import PluginPage from "./pages/[knowledgeSlug]/plugins/page";
import SourcePage from "./pages/[knowledgeSlug]/source/page";
import { RootProviders } from "./root-providers";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <RootProviders /> }>
          {/* <Route path="/" element={ <Home /> } /> */}
          <Route path="/:knowledgeSlug" element={ <Knowledge /> }>
            <Route path='chat' element={ <ChatPage /> } />
            <Route path='chat/:chatId' element={ <ChatPage /> } />
            <Route path='source' element={ <SourcePage /> } />
            <Route path='plugin' element={ <PluginPage /> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}