import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = (...routes: string[]) => SetMetadata(IS_PUBLIC_KEY, routes);
