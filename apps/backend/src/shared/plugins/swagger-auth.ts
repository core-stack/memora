import { getAllClassMethods } from "@/utils/get-all-class-methods";
import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { IS_PUBLIC_KEY } from "../controller/decorators/public";

export function SwaggerAuth() {
  return (target: any) => {
    const publicMethods: string[] = Reflect.getMetadata(IS_PUBLIC_KEY, target) || [];

    const methodNames = getAllClassMethods(target);

    methodNames.forEach(methodName => {
      if (!publicMethods.includes(methodName)) {
        let proto = target.prototype;
        while (proto && proto !== Object.prototype) {
          const descriptor = Object.getOwnPropertyDescriptor(proto, methodName);
          if (descriptor) {
            ApiBearerAuth("access-token")(target.prototype, methodName, descriptor);
            break;
          } else {
            proto = Object.getPrototypeOf(proto);
          }
        }
      }
    });
  };
}


export function Auth() {
  return applyDecorators(SwaggerAuth());
}
