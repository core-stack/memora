import { ContextField } from './context-field';

export const TenantId = (key = 'tenantId') =>
  ContextField({ source: 'params', key });

export const CreatedBy = () =>
  ContextField({ source: 'session', key: 'userId' });

export const MemberId = () =>
  ContextField({ source: 'memberId' });

export const FromQuery = (key: string) =>
  ContextField({ source: 'query', key });
