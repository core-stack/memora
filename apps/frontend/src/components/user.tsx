import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { getNameInitials } from '@/lib/string';
import { LogOut, Settings } from 'lucide-react';

export const UserInfo = () => {
  const { user, logout } = useAuth();

  const handleLogout = logout;

  const handleProfile = () => {
    alert("Configurações de Perfil - Implementar página de perfil")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button asChild className="gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback className="bg-primary text-white font-bold text-xs">
              {getNameInitials(user?.name || "")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Exit</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}