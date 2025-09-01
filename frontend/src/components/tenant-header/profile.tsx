"use client";
import { HelpCircle, LogOut, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import { cn } from '@/lib/utils';

export const UserProfile = () => {
  const router = useRouter();
  const t = useTranslations();
  const { data: user } = useApiQuery("/api/user/self");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { mutate } = useApiMutation("/api/auth/logout");
  const handleLogout = () => {
    mutate({}, { onSuccess: () => router.push("/auth/login") });
  }

  return (
    <Popover onOpenChange={setIsCollapsed} open={isCollapsed}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-3 transition-colors relative",
            isCollapsed ? "justify-center" : "",
          )}
        >
          <Avatar className='cursor-pointer'>
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" align={isCollapsed ? "center" : "start"}>
        <div className="flex items-center gap-4 pb-4 border-b mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{user?.name}</h4>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="grid gap-1 py-2">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            <User className="h-4 w-4" />
            <span>{t/*i18n*/("Profile")}</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
          >
            <HelpCircle className="h-4 w-4" />
            <span>{t/*i18n*/("Help and Support")}</span>
          </Link>
        </div>

        <div className="pt-2 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted w-full text-left text-red-500 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>{t/*i18n*/("Logout")}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}