import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function ApiFilterQuery<TEntity>(
  allowedFilters: (keyof TEntity)[] = [],
  allowedRelations: (keyof TEntity)[] = [],
  many = true
) {
  const decorators: MethodDecorator[] = [];

  if (allowedRelations.length > 0) {
    decorators.push(
      ApiQuery({
        name: "relations",
        required: false,
        type: String,
        isArray: true,
        description: `Relations. Allowed fields: ${allowedRelations.join(", ")}`,
        example: allowedRelations.slice(0, 2).join(",")
      })
    );
  }
  if (many) {
    decorators.push(
      ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Maximum number of records to return",
        example: 10
      }),
      ApiQuery({
        name: "offset",
        required: false,
        type: Number,
        description: "Number of records to skip",
        example: 0
      }),
      ApiQuery({
        name: "sort",
        required: false,
        type: String,
        isArray: true,
        description: `Sort order. Use "-" to DESC. Allowed fields: ${allowedFilters.join(", ")}`
      })
    );
  }

  allowedFilters.forEach(field => {
    const fieldName = String(field);
    decorators.push(
      ApiQuery({
        name: `filter[${fieldName}]`,
        required: false,
        description: `Filter by ${fieldName}`,
        type: String
      })
    );
  });

  return applyDecorators(...decorators);
}
