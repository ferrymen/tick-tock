import escape from 'cssesc'

/**
 * @param {*} className
 * @example:
 * cssesc('Ich ♥ Bücher');
 * → 'Ich \\2665  B\\FC cher'
 */
export default function escapeClassName(className) {
  return escape(className, { isIdentifier: true })
}
