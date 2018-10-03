/**
 * @fm-css at-rule
 * @param {*} config
 */

export default function(config) {
  console.log(config)
  return function(css) {
    console.log(css)
  }
}
