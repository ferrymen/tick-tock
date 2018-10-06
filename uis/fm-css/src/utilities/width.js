import _ from 'lodash'
import defineClass from '../utils/defineClass'

function defineWidths(widths) {
  return _.map(widths, (size, modifer) => {
    return defineClass(`u-w-${modifer}`, {
      width: size
    })
  })
}

export default {
  name: 'width',
  handle: config => {
    return _.flatten([defineWidths(config.width)])
  }
}
