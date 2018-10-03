/**
 * Main
 */
import { resolve } from 'path'

import postcss from 'postcss'
import _ from 'lodash'

import addDependencyMessage from './utils/addDependencyMessage'
import mergeConfigWithDefault from './utils/mergeConfigWithDefault'
import processFeatures from './utils/processFeatures'

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

  function getConfig() {
    if (_.isUndefined(opts)) {
      return require('../config/default')()
    } else if (!_.isObject(opts)) {
      delete require.cache[require.resolve(resolve(opts))]
    }

    return mergeConfigWithDefault(
      _.isObject(opts) ? opts : require(resolve(opts)),
      require('../config/default')()
    )
  }

  return postcss([...plugins, processFeatures(getConfig)])
})
