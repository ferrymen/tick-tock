import escape from 'css.escape'

/**
 * @param {*} className
 * @example:
 * cssesc('Ich ♥ Bücher');
 * → 'Ich \\2665  B\\FC cher'
 */
export default function escapeClassName(className) {
  return escape(className)
}
