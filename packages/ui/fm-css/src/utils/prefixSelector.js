import selectorParser from 'postcss-selector-parser'

/**
 * Add a class prefix
 * @param {*} prefix
 * @param {*} selector
 */
export default function(prefix, selector) {
  const getPrefix = typeof prefix === 'function' ? prefix : () => prefix

  return selectorParser(selectors => {
    selectors.walkClasses(classSelector => {
      classSelector.value = `${getPrefix('.' + classSelector.value)}${classSelector.value}`
    })
  }).processSync(selector)
}
