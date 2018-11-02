import { Type, isClass, hasOwnClassMetadata } from '@ferrymen/fm-ioc-core';
import { NonePointcut } from './decorators';

/**
 * is target can aspect or not.
 *
 */
export function isValideAspectTarget(targetType: Type<any>): boolean {
  if (
    !isClass(targetType) ||
    targetType === Object ||
    targetType === String ||
    targetType === Date ||
    targetType === Boolean ||
    targetType === Number
  ) {
    return false;
  }

  if (hasOwnClassMetadata(NonePointcut, targetType)) {
    return false;
  }

  return true;
}
