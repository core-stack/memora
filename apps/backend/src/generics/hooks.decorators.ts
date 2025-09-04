import { FilterOptions } from "./filter-options";

export type HookType =
  'beforeFind' | 'afterFind' |
  'beforeCreate' | 'afterCreate' |
  'beforeUpdate' | 'afterUpdate' |
  'beforeDelete' | 'afterDelete';

export type HookSignature<TEntity, T extends HookType> =
  T extends 'beforeFind' ? (opts: FilterOptions<TEntity>) => FilterOptions<TEntity> | Promise<FilterOptions<TEntity>> :
  T extends 'afterFind' ? (opts: FilterOptions<TEntity>, entities: TEntity[]) => TEntity[] | Promise<TEntity[]> :
  T extends 'beforeCreate' ? (data: Partial<TEntity>) => Partial<TEntity> | Promise<Partial<TEntity>> :
  T extends 'afterCreate' ? (data: TEntity) => TEntity | Promise<TEntity> :
  T extends 'beforeUpdate' ? (id: string, data: Partial<TEntity>) => [string, Partial<TEntity>] | Promise<[string, Partial<TEntity>]> :
  T extends 'afterUpdate' ? (id: string, data: TEntity) => void | Promise<void> :
  T extends 'beforeDelete' ? (id: string) => string | Promise<string> :
  T extends 'afterDelete' ? (id: string) => void | Promise<void> :
  never;

export function Hook<TEntity, T extends HookType>(type: T) {
  return function <
    Target extends { hooks?: Record<HookType, Function[]> },
    Key extends string,
    Descriptor extends TypedPropertyDescriptor<HookSignature<TEntity, T>>
  >(target: Target, _: Key, descriptor: Descriptor) {
    if (!target.hooks) {
      target.hooks = {
        beforeFind: [],
        afterFind: [],
        beforeCreate: [],
        afterCreate: [],
        beforeUpdate: [],
        afterUpdate: [],
        beforeDelete: [],
        afterDelete: [],
      };
    }

    target.hooks[type].push(descriptor.value!);
  };
}

export const BeforeCreate = <TEntity>() => Hook<TEntity, 'beforeCreate'>('beforeCreate');
export const AfterCreate = <TEntity>() => Hook<TEntity, 'afterCreate'>('afterCreate');
export const BeforeUpdate = <TEntity>() => Hook<TEntity, 'beforeUpdate'>('beforeUpdate');
export const AfterUpdate = <TEntity>() => Hook<TEntity, 'afterUpdate'>('afterUpdate');
export const BeforeFind = <TEntity>() => Hook<TEntity, 'beforeFind'>('beforeFind');
export const AfterFind = <TEntity>() => Hook<TEntity, 'afterFind'>('afterFind');
export const BeforeDelete = <TEntity>() => Hook<TEntity, 'beforeDelete'>('beforeDelete');
export const AfterDelete = <TEntity>() => Hook<TEntity, 'afterDelete'>('afterDelete');

