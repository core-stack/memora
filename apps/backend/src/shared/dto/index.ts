export abstract class Dto<TEntity> {
  abstract fromEntity(entity: TEntity[]): Dto<TEntity>[];
  abstract fromEntity(entity: TEntity): Dto<TEntity>;
  abstract fromEntity(entity: TEntity | TEntity[]): Dto<TEntity> | Dto<TEntity>[];
}