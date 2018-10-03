/**
 * Merge config file via lodash.defaultDeep
 */

import _ from 'lodash'

export default function(customConf, defaultConf) {
  return _.defaultsDeep(customConf, defaultConf)
}
