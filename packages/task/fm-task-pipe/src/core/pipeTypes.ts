/**
 * transform type.
 */
export type TransformType = Expression<ITransform>;

/**
 * transform config type.
 */
export type TransformConfig = ExpressionType<ITransform>;

/**
 * task transform express.
 */
export type TransformExpress = CtxType<TransformConfig[]>;

/**
 * transform dest express
 */
export type DestExpress = ObjectMap<TransformExpress> | TransformExpress;

/**
 *check target is transform or not.
 *
 */
export function isTransform(target: any): boolean {
  if (isBaseType(target) || isMetadataObject(target) || isObservable(target)) {
    return false;
  }

  return target && (target instanceof Stream || isFunction(target.pipe));
}
