import prefixSelector from './prefixSelector'

/**
 *
 * @param {*} css
 * @param {*} prefix
 */
export default function(css, prefix) {
  css.walkRules(rule => {
    rule.selectors = rule.selectors.map(selector => prefixSelector(prefix, selector))
  })

  return css
}
