/**
 * Add dependency messages
 */

import { existsSync } from 'fs'

export default function(file) {
  if (!existsSync(file)) {
    throw new Error(`Specified config file "${file}" does't exist.`)
  }

  return function(css, result) {
    result.messages.push({
      type: 'dependency',
      file,
      parent: css.source.input.file
    })
  }
}
