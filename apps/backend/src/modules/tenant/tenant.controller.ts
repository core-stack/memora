import type { Request, Response } from 'express';

import { CrudController, HttpPost } from '@/generics';
import { Body, Controller, Req, Res } from '@nestjs/common';
import {
  CreateTenantSchema, createTenantSchema, tenantFilterSchema, TenantSchema, updateTenantSchema
} from '@snipet/schemas';

import { TenantService } from './tenant.service';

@Controller('tenant')
export class TenantController extends CrudController<TenantSchema>(
  { 
    filterSchema: tenantFilterSchema,
    createDtoSchema: createTenantSchema,
    updateDtoSchema: updateTenantSchema,
    ignore: ["create"]
  }
) {
  constructor(service: TenantService) {
    super(service);
  }

  @HttpPost("")
  async createTenant(@Req() req: Request, @Res() res: Response,  @Body() data: Partial<CreateTenantSchema>) {
    const result = await this.service.create(data, { http: this.loadContext(req, res) });
    res.send(result);
  }
}
