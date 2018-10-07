import _ from 'lodash'

/**
 * clone node
 * @param {*} nodes
 */
export default function cloneNodes(nodes) {
  return _.map(nodes, node => node.clone())
}
