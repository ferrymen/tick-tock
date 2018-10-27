import _ from 'lodash'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import postcssJs from 'postcss-js'

/**
 * parse class definition
 * @param {*} styles
 * @example
 * parseObjectStyles({
    '.foo': {
      backgroundColor: 'red'
    }
  }) => .foo {
      background-color: red
    }
 */
export default function parseObjectStyles(styles) {
  if (!_.isArray(styles)) {
    return parseObjectStyles([styles])
  }

  return _.flatMap(
    styles,
    style => postcss([postcssNested]).process(style, { parser: postcssJs }).root.nodes
  )
}
