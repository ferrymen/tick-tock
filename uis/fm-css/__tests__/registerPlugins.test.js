import _ from 'lodash'
import postcss from 'postcss'
import registerPlugins from '../src/utils/registerPlugins'

function css(nodes) {
  return postcss.root({ nodes }).toString()
}

function registerPluginsWithValidConfig(config) {
  return registerPlugins(
    _.defaultsDeep(config, {
      lead: {
        prefix: '',
        important: false,
        separator: ':'
      }
    })
  )
}

it('plugins can create components with object syntax', () => {
  const { components } = registerPluginsWithValidConfig({
    plugins: [
      function({ registerComponents }) {
        registerComponents({
          '.btn-blue': {
            backgroundColor: 'blue',
            color: 'white',
            padding: '.5rem 1rem',
            borderRadius: '.25rem'
          },
          '.btn-blue:hover': {
            backgroundColor: 'darkblue'
          }
        })
      }
    ]
  })

  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue;
      color: white;
      padding: .5rem 1rem;
      border-radius: .25rem
    }
    .btn-blue:hover {
      background-color: darkblue
    }
  `)
})

it('plugins can create components with raw PostCSS nodes', () => {
  const { components } = registerPluginsWithValidConfig({
    plugins: [
      function({ registerComponents }) {
        registerComponents([
          postcss.rule({ selector: '.btn-blue' }).append([
            postcss.decl({
              prop: 'background-color',
              value: 'blue'
            }),
            postcss.decl({
              prop: 'color',
              value: 'white'
            }),
            postcss.decl({
              prop: 'padding',
              value: '.5rem 1rem'
            }),
            postcss.decl({
              prop: 'border-radius',
              value: '.25rem'
            })
          ]),
          postcss.rule({ selector: '.btn-blue:hover' }).append([
            postcss.decl({
              prop: 'background-color',
              value: 'darkblue'
            })
          ])
        ])
      }
    ]
  })

  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue;
      color: white;
      padding: .5rem 1rem;
      border-radius: .25rem
    }
    .btn-blue:hover {
      background-color: darkblue
    }
  `)
})

it('plugins can create components with mixed object styles and raw PostCSS nodes', () => {
  const { components } = registerPluginsWithValidConfig({
    plugins: [
      function({ registerComponents }) {
        registerComponents([
          postcss.rule({ selector: '.btn-blue' }).append([
            postcss.decl({
              prop: 'background-color',
              value: 'blue'
            }),
            postcss.decl({
              prop: 'color',
              value: 'white'
            }),
            postcss.decl({
              prop: 'padding',
              value: '.5rem 1rem'
            }),
            postcss.decl({
              prop: 'border-radius',
              value: '.25rem'
            })
          ]),
          {
            '.btn-blue:hover': {
              backgroundColor: 'darkblue'
            }
          }
        ])
      }
    ]
  })

  expect(css(components)).toMatchCss(`
    .btn-blue {
      background-color: blue;
      color: white;
      padding: .5rem 1rem;
      border-radius: .25rem
    }
    .btn-blue:hover {
      background-color: darkblue
    }
  `)
})
