import { BrowserRouter, Route, Routes } from 'react-router';

import ChatPage from './pages/[knowledgeSlug]/chat/page';
import Knowledge from './pages/[knowledgeSlug]/page';
import PluginPage from './pages/[knowledgeSlug]/plugins/page';
import SourcePage from './pages/[knowledgeSlug]/source/page';
import LLMManagementPage from './pages/llm/page';
import Home from './pages/page';
import { RootProviders } from './root-providers';
import CreateAccountPage from './pages/auth/create-account/page';
import LoginPage from './pages/auth/login/page';
import { ActivateAccountPage } from './pages/auth/activate/[token]/page';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <RootProviders /> }>
          <Route path="/" element={ <Home /> } />
          <Route path='/auth/create-account' element={ <CreateAccountPage /> } />
          <Route path='/auth/active-account' element={ <ActivateAccountPage /> } />
          <Route path='/auth/login' element={ <LoginPage /> } />
          <Route path='/llm' element={ <LLMManagementPage />} />
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