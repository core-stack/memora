"use client"

import { UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

import { TenantPageHeader } from '@/components/tenant-page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogType } from '@/dialogs';
import { useAuth } from '@/hooks/use-auth';
import { useDialog } from '@/hooks/use-dialog';
import { Permission } from '@snipet/permission';

import { InvitesTable } from './invite-table';
import { MembersTable } from './member-table';

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState("members")
  const { canInTenant } = useAuth();
  const { openDialog } = useDialog();
  
  return (
    <>
      <TenantPageHeader
        title='Members'
        description='Manage your team members'
        icon={<Users className="h-6 w-6 text-primary" />}
        action={
          canInTenant(Permission.CREATE_INVITE) ? {
            icon: <UserPlus className="mr-2 h-4 w-4" />,
            text: "Invite Member",
            action: () => openDialog({ type: DialogType.INVITE_MEMBER })
          } : undefined
        }
      />
      <Tabs defaultValue="members" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invites">Invites</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="members" className="space-y-4">
          <MembersTable />
        </TabsContent>

        <TabsContent value="invites" className="space-y-4">
          <InvitesTable />
        </TabsContent>
      </Tabs>
    </>
  )
}
