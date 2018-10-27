import postcss from 'postcss'
import _ from 'lodash'
import wrapWithVariants from './wrapWithVariants'

/**
 *
 * @param {*} utilities
 * @param {*} utilitiesOpts
 * @param {*} config
 */
export default function(utilities, utilitiesOpts, config) {
  if (!_.isArray(utilities)) {
    utilities = _.map(utilities, val => {
      return val
    })
  }
  utilities.forEach(utility => {
    if (!_.has(utilitiesOpts, utility.name)) {
      throw new Error(`Utility \`${utility.name}\` is missing from config.utilities`)
    }
  })

  return postcss.root({
    nodes: _(utilities)
      .reject(utility => utilitiesOpts[utility.name] === false)
      .flatMap(utility => wrapWithVariants(utility.handle(config), utilitiesOpts[utility.name]))
      .value()
  })
}
