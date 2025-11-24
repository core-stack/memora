"use client"

import { ArrowLeftRight, Database, Home, MessageCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Outlet } from 'react-router';

import { Link } from '@/components/ui/link';
import { SearchProvider } from '@/context/search-provider';
import { useApiKnowledge } from '@/gen';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useLocation } from '@/hooks/use-location';
import { useTenant } from '@/hooks/use-tenant';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { UserInfo } from '../user';

export function KnowledgeLayout() {
  const { tenant } = useTenant();
  const { data: knowledges = [] } = useApiKnowledge({ tenantId: tenant?.id ?? "" });
  const { pathname } = useLocation();
  const { slug } = useKnowledge();
  const knowledge = knowledges.find((knowledge) => knowledge.slug === slug);

  const menuItems = useMemo(() => [
    {
      id: "home",
      label: "Home",
      path: `/kn/${slug}`,
      icon: Home,
    },
    {
      id: "chat",
      label: "Chats",
      path: `/kn/${slug}/chat`,
      icon: MessageCircle,
    },
    {
      id: "source",
      label: "Source",
      path: `/kn/${slug}/source`,
      icon: Database,
    },
    // {
    //   id: "plugin",
    //   label: "Plugin",
    //   path: `/kn/${slug}/plugin`,
    //   icon: Plug,
    // },
  ], [slug]);

  const activeSection = menuItems.find((item) => pathname === item.path)?.id ?? "knowledge";

  const handleSelectTenant = () => {
    // openDialog({
    //   type: DialogType.SELECT_TENANT,
    //   props: { tenants: tenants ?? [], setTenant }
    // })
  }

  return (
    <div className='h-screen'>
      <SearchProvider>
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="flex items-center justify-between px-6 h-16">
            <div className='flex gap-4 h-full'>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Link href='/' className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
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
                      className={cn("gap-2 flex items-center h-full p-2 border-b-4 border-transparent hover:border-primary", isActive && "border-primary")}
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
                knowledges && knowledges?.length > 1 &&
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="gap-2 px-2" onClick={handleSelectTenant}>
                        <p className='font-bold'>{knowledge?.title}</p>
                        <ArrowLeftRight className='w-2 h-2 text-primary' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch knowledge base</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
              <UserInfo />
            </div>
          </div>
        </header>
        <div className='h-[calc(100vh-65px)]'>
          <Outlet />
        </div>
      </SearchProvider>
    </div>
  )
}
