import { randomUUID } from "crypto";
import moment from "moment";

import { Field } from "@/shared/model";

export abstract class BaseFragment {
  @Field({ type: "string", uuid: true })
  id: string;

  @Field({ type: "date" })
  createdAt: Date;

  @Field({ type: "date" })
  updatedAt: Date;

  @Field({ type: "string", required: true })
  content: string;

  abstract metadata: any;

  constructor(
    f: Omit<BaseFragment, "id" | "createdAt" | "updatedAt"> & {
      id?: string,
      createdAt?: Date,
      updatedAt?: Date
    }
  ) {
    Object.assign(this, f);
    this.id = f.id || randomUUID();
    this.createdAt = moment(f.createdAt).toDate();
    this.updatedAt = moment(f.updatedAt).toDate();
  }
}
