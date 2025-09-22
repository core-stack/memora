import { Outlet } from 'react-router';

import { TopBar } from '../../components/topbar';

export default function Knowledge() {
  return (
    <div className='h-screen flex flex-col'>
      <TopBar />
      <main className='flex-1 overflow-hidden'>
        <Outlet />
      </main>
    </div>
  )
}