/**
 * Process at-rule
 * @param {function} getConfig - obtain config file
 */
import postcss from 'postcss'
import _ from 'lodash'
import fmCssAtRule from '../features/fmCssAtRule'

export default function(getConfig) {
  return function(css) {
    const config = getConfig()

    return postcss([fmCssAtRule(config)]).process(css, {
      from: _.get(css, 'source.input.file')
    })
  }
}
