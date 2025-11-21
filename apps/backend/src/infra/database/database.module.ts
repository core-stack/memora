import path from "path";

import { env } from "@/env";
import { __root } from "@/root";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        url: env.DATABASE_URL,
        synchronize: false,
        entities: [ path.join(__root, "**/entities/*.entity.js") ]
      })
    })
  ]
})
export class DatabaseModule {}
