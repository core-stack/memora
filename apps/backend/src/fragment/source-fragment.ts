import type { SourceMetadata } from "@/entities/metadata.types";
import {
  SourceAudioMetadata, SourceDocMetadata, SourceImageMetadata, SourceType, SourceVideoMetadata
} from "@/entities";
import { Field } from "@/shared/model";
import { ApiExtraModels } from "@nestjs/swagger";

import { BaseFragment } from "./fragment";

@ApiExtraModels(SourceDocMetadata, SourceImageMetadata, SourceVideoMetadata, SourceAudioMetadata)
export class SourceFragment extends BaseFragment {
  @Field({ type: "number", positive: true, required: false })
  seqId?: number;

  @Field({ type: "string", required: true, uuid: true })
  knowledgeId: string;

  @Field({ type: "string", required: true, uuid: true })
  tenantId: string;

  @Field({ type: "string", required: true, uuid: true })
  sourceId: string;

  @Field({ type: "enum", enum: SourceType, description: "The type of the source" })
  sourceType: SourceType;

  @Field({
    type: "oneOf",
    classes: [
      () => SourceDocMetadata,
      () => SourceImageMetadata,
      () => SourceVideoMetadata,
      () => SourceAudioMetadata
    ]
  })
  // @ApiProperty({
  //   required: true, description: "The metadata of the source",
  //   oneOf: [
  //     {
  //       $ref: getSchemaPath(SourceDocMetadata),
  //     },
  //     {
  //       $ref: getSchemaPath(SourceImageMetadata),
  //     },
  //     {
  //       $ref: getSchemaPath(SourceVideoMetadata),
  //     },
  //     {
  //       $ref: getSchemaPath(SourceAudioMetadata),
  //     }
  //   ]
  // })
  metadata: SourceMetadata;

  constructor(
    f: Omit<SourceFragment, "id" | "createdAt" | "updatedAt"> & {
      id?: string, createdAt?: Date, updatedAt?: Date
    }
  ) {
    super(f);
    this.knowledgeId = f.knowledgeId;
    this.sourceType = f.sourceType;
    this.tenantId = f.tenantId;
    this.metadata = f.metadata;
    this.sourceId = f.sourceId;
    this.seqId = f.seqId;
    this.metadata = f.metadata;
  }

  static fromObject(obj: any): SourceFragment {
    return new SourceFragment(obj);
  }
}
