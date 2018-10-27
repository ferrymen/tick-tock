import postcss from 'postcss'
import * as utilities from '../utilities'
import preGenerateUtilities from './preGenerateUtilities'
import prefixTree from './prefixTree'

/**
 * generate util class
 * @param {*} config
 * @param {*} pluginUtilities
 * @example
 * .u-w-1/2
 */
export default function(config, pluginUtilities) {
  const uts = preGenerateUtilities(utilities, config.utilities, config)

  if (config.lead.important) {
    uts.walkDecls(decl => (decl.important = true))
  }

  const utsTree = postcss.root({
    nodes: uts.nodes
  })

  prefixTree(utsTree, config.lead.prefix)

  return [...utsTree.nodes, ...pluginUtilities]
}
