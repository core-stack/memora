import { Request } from "express";

import { Session } from "@/modules/auth/types";

export type AuthRequest = Request & { session?: Session, isApi?: boolean };
