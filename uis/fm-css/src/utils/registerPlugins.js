import postcss from 'postcss'
import Node from 'postcss/lib/node'
import _ from 'lodash'
import parseObjectStyles from './parseObjectStyles'
import prefixSelector from './prefixSelector'
import wrapWithVariants from './wrapWithVariants'

/**
 * Inject config,addComponents
 * @param {*} config
 */
export default function(config) {
  const pluginComponents = []
  const pluginUtilities = []

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
      },
      registerUtilities: (utilities, options) => {
        const defaultOptions = {
          variants: [],
          respectPrefix: true,
          respectImportant: true
        }

        options = Array.isArray(options)
          ? Object.assign({}, defaultOptions, { variants: options })
          : _.defaults(options, defaultOptions)

        const styles = postcss.root({ nodes: parseStyles(utilities) })

        styles.walkRules(rule => {
          if (options.respectPrefix) {
            rule.selector = prefixSelector(config.lead.prefix, rule.selector)
          }
        })

        pluginUtilities.push(wrapWithVariants(styles.nodes, options.variants))
      }
    })
  })

  return {
    components: pluginComponents,
    utilities: pluginUtilities
  }
}
