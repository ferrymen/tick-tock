import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from './escapeClassName'

/**
 * Define class
 * @param {*} className
 * @param {*} properties
 */
export default function(className, properties) {
  const decls = _.map(properties, (value, property) => {
    return postcss.decl({
      prop: property,
      value
    })
  })

  return postcss
    .rule({
      selector: `.${escapeClassName(className)}`
    })
    .append(decls)
}
