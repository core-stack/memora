import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import z from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema | z.ZodObject<any>) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.format(),
      });
    }

    return result.data;
  }
}