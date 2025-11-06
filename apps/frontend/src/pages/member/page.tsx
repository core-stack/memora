"use client"

import { UserPlus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Permission } from '@snipet/permission';

import { InvitesTable } from './invite-table';
import { MembersTable } from './member-table';

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState("members")
  const { can } = useAuth();
  
  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Members</CardTitle>
          <CardDescription>Manage your team members</CardDescription>
        </div>
        {
          can(Permission.CREATE_INVITE) &&
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>
        }
      </div>
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

    </div>
  )
}
