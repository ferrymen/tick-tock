import { isString } from '@ferrymen/fm-ioc-core';
import path from 'path';

/**
 * convert path to absolute path.
 *
 */
export function toAbsolutePath(root: string, pathstr: string): string {
  if (!root || path.isAbsolute(pathstr)) {
    return pathstr;
  }
  return path.join(root, pathstr);
}

/**
 * convert src to absolute path src.
 *
 */
export function toAbsoluteSrc(
  root: string,
  src: string | string[]
): string | string[] {
  if (isString(src)) {
    return prefixSrc(root, src);
  } else {
    return src.map(p => prefixSrc(root, p));
  }
}

function prefixSrc(root: string, strSrc: string): string {
  let prefix = '';
  if (/^!/.test(strSrc)) {
    prefix = '!';
    strSrc = strSrc.substring(1, strSrc.length);
  }
  return prefix + toAbsolutePath(root, strSrc);
}
