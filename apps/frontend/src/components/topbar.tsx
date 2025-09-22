import { Brain } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { Form } from '@/components/ui/form';
import { Link } from '@/components/ui/link';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useLocation } from '@/hooks/use-location';
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
  const form = useForm();
  return (
    <Form {...form}>
      <FormInput className='w-full' fieldclassname='w-full' name='search' placeholder='Search' />
    </Form>
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