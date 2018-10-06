import postcss from 'postcss'
import plugin from '../src/features/responsiveAtRule'
import config from '../config/stub'

function run(input, opts = config) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

it('it can generate responsive variants', () => {
  const input = `
    @responsive {
      .foo { color: yello }
      .bar { color: brown }
    }
  `
  const output = `
    .foo { color: yello }
    .bar { color: brown }
    @media (min-width: 500px) {
      .sm\\:foo { color: yello }
      .sm\\:bar { color: brown }
    }
    @media (min-width: 1000px) {
      .lg\\:foo { color: yello }
      .lg\\:bar { color: brown }
    }
  `

  return run(input, {
    screens: {
      sm: '500px',
      lg: '1000px'
    },
    lead: {
      separator: ':'
    }
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})
