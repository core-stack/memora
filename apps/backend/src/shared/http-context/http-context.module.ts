import { Module } from "@nestjs/common";

import { HTTPContext } from "./http-context";

@Module({
  providers: [ HTTPContext ],
  exports: [ HTTPContext ]
})
export class HTTPContextModule {}
