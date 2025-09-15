import { PluginRepository } from '@/modules/plugin/plugin.repository';
import { Plugin } from '@memora/schemas';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PluginManager implements OnModuleInit {
  private plugins: Plugin[] = [];

  constructor(
    private readonly pluginRepository: PluginRepository
  ) {}

  async onModuleInit() {
    this.plugins = await this.pluginRepository.find({});
  }
}