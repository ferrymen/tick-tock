import postcss from 'postcss'
import _ from 'lodash'
import generateVariantFunction from '../utils/generateVariantFunction'

function generatePseudoClassVariant(pseudoClass) {
  return generateVariantFunction(({ modifySelectors, separator }) => {
    return modifySelectors(({ className }) => {
      return `.${pseudoClass}${separator}${className}:${pseudoClass}`
    })
  })
}

const defaultVariantGenerators = {
  hover: generatePseudoClassVariant('hover'),
  active: generatePseudoClassVariant('active')
}

export default function(config, { variantGenerators: pluginVariantGenerators }) {
  return function(css) {
    const variantGenerators = {
      ...defaultVariantGenerators,
      ...pluginVariantGenerators
    }

    css.walkAtRules('variants', atRule => {
      const variants = postcss.list.comma(atRule.params).filter(variant => variant !== '')

      if (variants.includes('responsive')) {
        const responsiveParent = postcss.atRule({ name: 'responsive' })
        atRule.before(responsiveParent)
        responsiveParent.append(atRule) //  @responsive {}
      }

      atRule.before(atRule.clone().nodes)

      _.forEach(['hover', 'active'], variant => {
        if (variants.includes(variant)) {
          variantGenerators[variant](atRule, config)
        }
      })

      atRule.remove()
    })
  }
}
