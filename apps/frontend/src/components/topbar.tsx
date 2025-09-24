import { Brain, Command, Search } from 'lucide-react';

import { Link } from '@/components/ui/link';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useLocation } from '@/hooks/use-location';
import { useSearch } from '@/hooks/use-search';
import { cn } from '@/lib/utils';

import { ThemeToggle } from './theme-toggle';

export const TopBar = () => {
  const { slug } = useKnowledge();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-16 w-full justify-between items-center gap-2 px-4">
        <div className='flex gap-10 h-full items-center'>
          <Brain />
          <nav className='flex items-center gap-10 h-full'>
            <NavLink href={`/${slug}/chat`}>Chats</NavLink>
            <NavLink href={`/${slug}/source`}>Source</NavLink>
            <NavLink href={`/${slug}/plugin`}>Plugin</NavLink>
          </nav>
        </div>
        <div className='flex w-full max-w-[40%] gap-2 items-center'>
          <TopBarSearch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

const TopBarSearch = () => {
  const { openSearch } = useSearch();

  return (
    <div onClick={openSearch} className="flex items-center gap-3 p-4 w-full cursor-pointer">
      <Search className="w-5 h-5 text-muted-foreground" />
      <div className='w-full border border-border p-2 rounded-md text-sm text-muted-foreground'>
        Search files, functions, and content...
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Command className="w-3 h-3" />
        <span>K</span>
      </div>
    </div>
  )
}

type NavLinkProps = {
  href: string;
  children: React.ReactNode
}
const NavLink = ({ children, href }: NavLinkProps) => {
  const { pathname } = useLocation();
  const active = pathname.startsWith(href);

  return (
    <Link
      className={cn(
        'font-medium transition border-b-4 pt-1 h-full flex items-center border-transparent hover:text-primary hover:border-primary',
        active && 'border-primary text-primary'
      )}
      href={href}
    >{children}</Link>
  )
}