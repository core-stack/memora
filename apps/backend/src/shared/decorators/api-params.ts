import { DECORATORS } from '@nestjs/swagger/dist/constants';

export function ApiParamsInherit(params: Array<{ name: string; type?: any; required?: boolean }>) {
  return (target: any) => {
    let proto = target.prototype;
    while (proto && proto !== Object.prototype) {
      const methodNames = Object.getOwnPropertyNames(proto)
        .filter(
          (prop) =>
            typeof proto[prop] === 'function' &&
            prop !== 'constructor'
        );

      for (const methodName of methodNames) {
        const method = proto[methodName];

        for (const p of params) {
          const existing = Reflect.getMetadata(DECORATORS.API_PARAMETERS, method) || [];

          Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
              ...existing,
              {
                name: p.name,
                in: 'path',
                required: p.required ?? true,
                type: p.type ?? String,
              },
            ],
            method,
          );
        }
      }

      // vai para o próximo nível da cadeia
      proto = Object.getPrototypeOf(proto);
    }

  };
}
