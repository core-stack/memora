import { BrowserRouter, Route, Routes } from 'react-router';

import { KnowledgeLayout } from './components/layout/knowledge.layout';
import { TenantLayout } from './components/layout/tenant.layout';
import { TenantProvider } from './context/tenant';
import ChatPage from './pages/[knowledgeSlug]/chat/page';
import KnowledgePage from './pages/[knowledgeSlug]/page';
import SourcePage from './pages/[knowledgeSlug]/source/page';
import { ActivateAccountPage } from './pages/auth/activate/[token]/page';
import CreateAccountPage from './pages/auth/create-account/page';
import LoginPage from './pages/auth/login/page';
import LLMManagementPage from './pages/llm/page';
import MembersPage from './pages/member/page';
import Home from './pages/page';
import { RootProviders } from './root-providers';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <RootProviders /> }>
          <Route path='/auth'>
            <Route path='create-account' element={ <CreateAccountPage /> } />
            <Route path='activate/:token' element={ <ActivateAccountPage /> } />
            <Route path='login' element={ <LoginPage /> } />
          </Route>
          <Route path="/" element={ <TenantProvider /> }>
            <Route element={ <TenantLayout /> }>
              <Route path="/" element={ <Home /> } />
              <Route path='/llm' element={ <LLMManagementPage />} />
              <Route path='/member' element={ <MembersPage />} />
            </Route>
            <Route path="/kn/:knowledgeSlug" element={ <KnowledgeLayout /> }>
              <Route path='' element={ <KnowledgePage /> } />
              <Route path='chat' element={ <ChatPage /> } />
              <Route path='chat/:chatId' element={ <ChatPage /> } />
              <Route path='source' element={ <SourcePage /> } />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}