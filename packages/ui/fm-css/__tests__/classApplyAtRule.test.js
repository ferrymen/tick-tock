import postcss from 'postcss'
import plugin from '../src/features/classApplyAtRule'
import config from '../config/stub'

function run(input, opts = config) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

it('it can class include', () => {
  const input = `
    .foo { background: yello }
    .bar {
      @apply .foo;
      color: brown;
    }
  `
  const output = `
    .foo { background: yello }
    .bar { background: yello; color: brown; }
  `

  return run(input).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})
