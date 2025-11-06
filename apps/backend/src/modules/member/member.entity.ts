import z from 'zod';

import { memberSchema } from '@snipet/schemas';

import { roleEntity } from '../role/role.entity';
import { tenantEntity } from '../tenant/tenant.entity';
import { userEntitySchema } from '../user/user.entity';

export const memberEntity = memberSchema.extend({
  user: z.lazy(() => userEntitySchema).optional(),
  tenant: z.lazy(() => tenantEntity).optional(),
  role: z.lazy(() => roleEntity).optional(),
});
export type MemberEntity = z.infer<typeof memberEntity>;