import { Building, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';

import { UserProfile } from './profile';

export function TenantsHeader() {
  const t = useTranslations()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center m-auto justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            <span className="font-bold">SaaS Template</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/t" className="text-sm font-medium transition-colors hover:text-primary">
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                {t/*i18n*/("Tenants")}
              </span>
            </Link>
            <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {t/*i18n*/("Profile")}
              </span>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
