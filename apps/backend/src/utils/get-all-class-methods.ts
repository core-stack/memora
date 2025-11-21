export const getAllClassMethods = (target: any): string[] => {
  const methods: string[] = [];
  let proto = target.prototype;
  while (proto && proto !== Object.prototype) {
    const methodNames = Object.getOwnPropertyNames(proto)
      .filter(
        (prop) =>
          typeof proto[prop] === "function" &&
          prop !== "constructor"
      );
    methods.push(...methodNames);
    proto = Object.getPrototypeOf(proto);
  }
  return methods;
};
