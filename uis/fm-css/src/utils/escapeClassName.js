import escape from 'css.escape'

/**
 * @param {*} className
 * @example:
 * escape('.sm:foo') => '.sm\\:foo'
 */
export default function escapeClassName(className) {
  return escape(className)
}
