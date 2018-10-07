import _ from 'lodash'
import defineClass from './defineClass'

/**
 * defineClasses
 * @param {*} classes 
 * @example
 * defineClasses({
    flex: {
      display: 'flex',
    },
    'inline-flex': {
      display: 'inline-flex',
    }
  })
 */
export default function defineClasses(classes) {
  return _.map(classes, (properties, className) => {
    return defineClass(className, properties)
  })
}
