import _ from 'lodash'
import buildMediaQuery from '../utils/buildMediaQuery'

/**
 * @screen
 * @param {*} config
 * @example
 * @screen sm {
 *  .foo {color: red}
 * }
 */
export default function(config) {
  return function(css) {
    css.walkAtRules('screen', atRule => {
      const screen = atRule.params

      if (!_.has(config.screens, screen)) {
        throw atRule.error(`No \`${screen}\` screen found.`)
      }

      atRule.name = 'media'
      atRule.params = buildMediaQuery(config.screens[screen])
    })
  }
}
