import _ from 'lodash'
import postcss from 'postcss'
import escapeClassName from '../utils/escapeClassName'
import prefixSelector from '../utils/prefixSelector'

function buildClassTable(css) {
  const classTable = {}

  css.walkRules(rule => {
    if (!_.has(classTable, rule.selector)) {
      classTable[rule.selector] = []
    }
    classTable[rule.selector].push(rule)
  })

  return classTable
}

function buildShadowTable(utilities) {
  const root = postcss.root()

  postcss.root({ nodes: utilities }).walkAtRules('variants', atRule => {
    root.append(atRule.clone().nodes)
  })

  return buildClassTable(root)
}

function normalizeClassName(className) {
  return `.${escapeClassName(_.trimStart(className, '.'))}`
}

function findClass(classToApply, classTable, onError) {
  const matches = _.get(classTable, classToApply, [])

  if (_.isEmpty(matches)) {
    return []
  }

  if (matches.length > 1) {
    // prettier-ignore
    throw onError(`\`@apply\` cannot be used with ${classToApply} because ${classToApply} is included in multiple rulesets.`)
  }

  const [match] = matches

  if (match.parent.type !== 'root') {
    // prettier-ignore
    throw onError(`\`@apply\` cannot be used with ${classToApply} because ${classToApply} is nested inside of an at-rule (@${match.parent.name}).`)
  }

  return match.clone().nodes
}

/**
 * @apply
 * @param {*} config
 * @param {*} utilities
 * @example
 * .foo {color: red}
 * .bar {@apply .foo}
 */
export default function(config, utilities) {
  return function(css) {
    const classLookup = buildClassTable(css)
    const shadowLookup = buildShadowTable(utilities)

    css.walkRules(rule => {
      rule.walkAtRules('apply', atRule => {
        const classesAndProperties = postcss.list.space(atRule.params)

        // http://cssnext.io/features/#custom-properties-set-apply
        const [customProperties, classes] = _.partition(classesAndProperties, classOrProperty => {
          return _.startsWith(classOrProperty, '--')
        })

        const decls = _(classes)
          .reject(cssClass => cssClass === '!important')
          .flatMap(cssClass => {
            const classToApply = normalizeClassName(cssClass)
            const onError = message => {
              return atRule.error(message)
            }

            return _.reduce(
              [
                () => findClass(classToApply, classLookup, onError),
                () => findClass(classToApply, shadowLookup, onError),
                () =>
                  findClass(
                    prefixSelector(config.lead.prefix, classToApply),
                    shadowLookup,
                    onError
                  ),
                () => {
                  // prettier-ignore
                  throw onError(`\`@apply\` cannot be used with \`${classToApply}\` because \`${classToApply}\` either cannot be found, or it's actual definition includes a pseudo-selector like :hover, :active, etc. If you're sure that \`${classToApply}\` exists, make sure that any \`@import\` statements are being properly processed *before* FM CSS sees your CSS, as \`@apply\` can only be used for classes in the same CSS tree.`)
                }
              ],
              (classDecls, candidate) => (!_.isEmpty(classDecls) ? classDecls : candidate()),
              []
            )
          })
          .value()

        _.tap(_.last(classesAndProperties) === '!important', important => {
          decls.forEach(decl => (decl.important = important))
        })

        atRule.before(decls)
        atRule.params = customProperties.join(' ')

        if (_.isEmpty(customProperties)) {
          atRule.remove()
        }
      })
    })
  }
}
