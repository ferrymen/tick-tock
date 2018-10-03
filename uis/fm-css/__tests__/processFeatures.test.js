import postcss from 'postcss'
import { readFileSync } from 'fs'
import fmCss from '../src'
import { resolve } from 'path'

it('Verify source.input.file', () => {
  const inputFile = resolve(`${__dirname}/fixtures/input.css`)
  const input = readFileSync(inputFile, 'utf8')

  // from is source.input.file
  return postcss([fmCss()])
    .process(input, { from: inputFile })
    .then(result => {
      expect(result.root.source.input.file).toEqual(inputFile)
    })
})
