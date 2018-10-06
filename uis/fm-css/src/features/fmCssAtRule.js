/**
 * @fm-css at-rule
 * @param {*} config
 */

import postcss from 'postcss'
import fs from 'fs'
import _ from 'lodash'

export default function(config, { components: pluginComponents }, pluginUtilities) {
  function updateSource(nodes, source) {
    return _.tap(_.isArray(nodes) ? postcss.root({ nodes }) : nodes, tree => {
      // Traverses the container's descendant nodes, calling callback for eache node
      tree.walk(node => (node.source = source))
    })
  }
  return function(css) {
    css.walkAtRules('fm-css', atRule => {
      if (atRule.params === 'preload') {
        const preloadTree = postcss.parse(
          fs.readFileSync(`${__dirname}/../../css/preload.css`, 'utf8')
        )
        atRule.before(updateSource(preloadTree, atRule.source))
        atRule.remove()
      }

      if (atRule.params === 'components') {
        atRule.before(updateSource(pluginComponents, atRule.source))
        atRule.remove()
      }

      if (atRule.params === 'utilities') {
        atRule.before(updateSource(pluginUtilities, atRule.source))
        atRule.remove()
      }
    })
  }
}
