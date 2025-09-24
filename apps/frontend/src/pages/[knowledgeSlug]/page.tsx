import { Outlet } from 'react-router';

import { SearchProvider } from '@/context/search-provider';

import { TopBar } from '../../components/topbar';

export default function Knowledge() {
  return (
    <SearchProvider>
      <div className='h-screen flex flex-col'>
        <TopBar />
        <main className='flex-1 overflow-hidden'>
          <Outlet />
        </main>
      </div>
    </SearchProvider>
  )
}