export const mergeBy = <T, K extends keyof T>(key: K, ...lists: T[][]): T[] => {
  const map = new Map<T[K], T>();

  for (const item of lists.flat(1)) {
    map.set(item[key], item);
  }

  return [ ...map.values() ];
};
