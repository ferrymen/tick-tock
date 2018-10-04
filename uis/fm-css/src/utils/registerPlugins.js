import postcss from 'postcss'
import Node from 'postcss/lib/node'
import _ from 'lodash'
import parseObjectStyles from './parseObjectStyles'
import prefixSelector from './prefixSelector'

/**
 * Inject config,addComponents
 * @param {*} config
 */
export default function(config) {
  const pluginComponents = []

  function parseStyles(styles) {
    if (!_.isArray(styles)) {
      return parseStyles([styles])
    }

    return _.flatMap(styles, style => (style instanceof Node ? style : parseObjectStyles(style)))
  }

  config.plugins.forEach(plugin => {
    plugin({
      config: (path, defaultVal) => _.get(config, path, defaultVal),
      registerComponents: (components, options) => {
        options = Object.assign({ respectPrefix: true }, options)
        const styles = postcss.root({ nodes: parseStyles(components) })

        styles.walkRules(rule => {
          if (options.respectPrefix) {
            rule.selector = prefixSelector(config.lead.prefix, rule.selector)
          }
        })

        pluginComponents.push(...styles.nodes)
      }
    })
  })

  return {
    components: pluginComponents
  }
}
