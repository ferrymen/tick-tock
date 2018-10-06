import postcss from 'postcss'
import _ from 'lodash'
import fmCssAtRule from '../features/fmCssAtRule'
import registerPlugins from './registerPlugins'
import generateUtilities from './generateUtilities'

/**
 * Process at-rule
 * @param {function} getConfig - obtain config file
 */
export default function(getConfig) {
  return function(css) {
    const config = getConfig()
    const registerPlugin = registerPlugins(config)
    const utilities = generateUtilities(config, registerPlugin.utilities)

    return postcss([fmCssAtRule(config, registerPlugin, utilities)]).process(css, {
      from: _.get(css, 'source.input.file')
    })
  }
}
