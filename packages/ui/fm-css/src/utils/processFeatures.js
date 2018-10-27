import postcss from 'postcss'
import _ from 'lodash'
import registerPlugins from './registerPlugins'
import generateUtilities from './generateUtilities'
import fmCssAtRule from '../features/fmCssAtRule'
import evaluateFunctions from '../features/evaluateFunctions'
import variantsAtRule from '../features/variantsAtRule'
import responsiveAtRule from '../features/responsiveAtRule'
import screenAtRule from '../features/screenAtRule'
import classApplyAtRule from '../features/classApplyAtRule'

/**
 * Process at-rule
 * @param {function} getConfig - obtain config file
 */
export default function(getConfig) {
  return function(css) {
    const config = getConfig()
    const registerPlugin = registerPlugins(config)
    const utilities = generateUtilities(config, registerPlugin.utilities)

    return postcss([
      fmCssAtRule(config, registerPlugin, utilities),
      evaluateFunctions(config),
      variantsAtRule(config, registerPlugin),
      responsiveAtRule(config),
      screenAtRule(config),
      classApplyAtRule(config, utilities)
    ]).process(css, {
      from: _.get(css, 'source.input.file')
    })
  }
}
