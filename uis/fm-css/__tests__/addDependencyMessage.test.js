import { resolve } from 'path'
import postcss from 'postcss'
import fmCss from '../src'

it('Throw error if config file does not exist', () => {
  const conf = resolve(`./fixtures/custom-config.js`)
  try {
    postcss(fmCss(conf))
  } catch (error) {
    expect(() => {
      throw error
    }).toThrow(`Specified config file "${conf}" does't exist.`)
  }
})

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
