import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments
} from "class-validator";

export function Match(property: string, options?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: "Match",
      target: object.constructor,
      propertyName,
      constraints: [ property ],
      options,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [ relatedPropertyName ] = args.constraints;
          return value === (args.object as any)[relatedPropertyName];
        }
      }
    });
  };
}
