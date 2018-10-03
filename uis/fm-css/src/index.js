/**
 * Main
 */
import { resolve } from 'path'

import postcss from 'postcss'
import _ from 'lodash'

import addDependencyMessage from './utils/addDependencyMessage'

/**
 * @param {string|object} opts - A config file or params
 * @returns {processor} - A processor that will apply plugins as CSS processors
 */
export default postcss.plugin('fm-css', opts => {
  const plugins = []

  // opts as path
  if (!_.isUndefined(opts) && !_.isObject(opts)) {
    plugins.push(addDependencyMessage(resolve(opts)))
  }

  return postcss([...plugins])
})
