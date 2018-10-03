import { resolve } from 'path'
import postcss from 'postcss'
import fmCss from '../src'

it('Add the right dependency message', () => {
  const conf = resolve(`${__dirname}/fixtures/custom-config.js`)
  // ./ point to root dir(**/*/fm-css/), so use ${__dirname}
  return postcss([fmCss(conf)])
    .process('', { from: undefined })
    .then(result => {
      expect(result.messages).toEqual([
        {
          type: 'dependency',
          file: conf,
          parent: undefined
        }
      ])
    })
})
