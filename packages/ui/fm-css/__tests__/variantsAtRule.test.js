import postcss from 'postcss'
import plugin from '../src/features/variantsAtRule'
import config from '../config/stub'
import registerPlugins from '../src/utils/registerPlugins'

function run(input, opts = config) {
  return postcss([plugin(opts, registerPlugins(opts))]).process(input, {
    from: undefined
  })
}

it('it can generate hover variants', () => {
  const input = `
    @variants hover {
      .foo { color: yellow; }
      .bar { color: brown; }
    }
  `
  const output = `
    .foo { color: yellow; }
    .bar { color: brown; }
    .hover\\:foo:hover { color: yellow; }
    .hover\\:bar:hover { color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})

it('it wraps the output in a responsive at-rule if responsive is included as a variant', () => {
  const input = `
    @variants responsive, hover {
      .foo { color: yellow; }
      .bar { color: brown; }
    }
  `
  const output = `
    @responsive {
      .foo { color: yellow; }
      .bar { color: brown; }
      .hover\\:foo:hover { color: yellow; }
      .hover\\:bar:hover { color: brown; }
    }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})
