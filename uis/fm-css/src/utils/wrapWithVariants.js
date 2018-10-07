import _ from 'lodash'
import postcss from 'postcss'
import cloneNodes from './cloneNodes'

/**
 * add variants at-rule
 * @param {*} rules
 * @param {*} variants
 */
export default function wrapWithVariants(rules, variants) {
  return postcss
    .atRule({
      name: 'variants',
      params: variants.join(', ')
    })
    .append(cloneNodes(_.isArray(rules) ? rules : [rules]))
}
