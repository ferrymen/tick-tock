import postcss from 'postcss'
import plugin from '../src/features/screenAtRule'
import config from '../config/stub'

function run(input, opts = config) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

it('it can generate screen variants', () => {
  const input = `
    @screen sm {
      .foo { color: yello }
      .bar { color: brown }
    }
  `
  const output = `
    @media (min-width: 500px) {
      .foo { color: yello }
      .bar { color: brown }
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
