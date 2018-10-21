import _ from 'lodash'

/**
 * Merge config file via lodash.defaultDeep
 */
export default function(customConf, defaultConf) {
  return _.defaultsDeep(customConf, defaultConf)
}
