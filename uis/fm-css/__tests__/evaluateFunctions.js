import postcss from 'postcss'
import plugin from '../src/features/evaluateFunctions'
import config from '../config/stub'

function run(input, opts = config) {
  return postcss([plugin(opts)]).process(input, { from: undefined })
}

it('it can class include', () => {
  const input = `
    .bar {
      color: config('colors.orange');
    }
  `
  const output = `
    .bar { color: #f6993f; }
  `

  return run(input, {
    colors: {
      orange: '#f6993f'
    }
  }).then(result => {
    expect(result.css).toMatchCss(output)
    expect(result.warnings().length).toBe(0)
  })
})
