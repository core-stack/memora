"use client"

import { ArrowLeftRight, Brain, Database, Plug, Settings, Users } from 'lucide-react';
import { Outlet } from 'react-router';

import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';
import { useLocation } from '@/hooks/use-location';
import { useTenant } from '@/hooks/use-tenant';
import { cn } from '@/lib/utils';

import { UserInfo } from '../user';

const menuItems = [
  {
    id: "knowledge",
    label: "Knowledge",
    path: '/',
    icon: Database,
  },
  {
    id: "llm",
    label: "LLMs",
    path: '/llm',
    icon: Brain,
  },
  {
    id: "integrations",
    label: "Integrations",
    path: '/integrations',
    icon: Plug,
  },
  {
    id: "member",
    label: "Members",
    path: '/member',
    icon: Users,
  },
  {
    id: "settings",
    label: "Settings",
    path: '/settings',
    icon: Settings,
  }

]

export function TenantLayout() {
  const { tenant, tenants, setTenant } = useTenant();
  const { pathname } = useLocation();
  const { openDialog } = useDialog();
  const activeSection = menuItems.find((item) => pathname === item.path)?.id ?? "knowledge";


  const handleSelectTenant = () => {
    openDialog({
      type: DialogType.SELECT_TENANT,
      props: { tenants: tenants ?? [], setTenant }
    })
  }

  return (
    <div>
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 h-16">
          <div className='flex gap-4 h-full'>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Link href='/' className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                  <img src="/logo.svg" className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <Link
                    key={item.id}
                    className={cn("gap-2 flex items-center h-full p-2 border-b-4 hover:border-primary border-transparent", isActive && "border-primary")}
                    href={item.path}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className='flex gap-2'>
            {
              tenants && tenants?.length > 1 &&
              <Button variant="ghost" className="gap-2 px-2" onClick={handleSelectTenant}>
                <p className='font-bold'>{tenant?.name}</p>
                <ArrowLeftRight className='w-2 h-2 text-primary' />
              </Button>
            }
            <UserInfo />
          </div>
        </div>
      </header>
      <div className="h-full bg-background">
        <div className="container mx-auto py-8 px-4 max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
