import preGenerateUtilities from '../src/utils/preGenerateUtilities'
import defineClasses from '../src/utils/defineClasses'

function textAlign() {
  return defineClasses({
    'text-left': { 'text-align': 'left' },
    'text-right': { 'text-align': 'right' },
    'text-center': { 'text-align': 'center' }
  })
}

it('an empty variants list generate a @variants at-rult with no param', () => {
  const result = preGenerateUtilities([{ name: 'textAlign', handle: textAlign }], { textAlign: [] })
  const expected = `
    @variants {
      .text-left { text-align: left }
      .text-right { text-align: right }
      .text-center { text-align: center }
    }
  `

  expect(result.toString()).toMatchCss(expected)
})

it('a `false` variants list generate no output', () => {
  const result = preGenerateUtilities([{ name: 'textAlign', handle: textAlign }], {
    textAlign: false
  })

  expect(result.toString()).toMatchCss('')
})

it('specified variants are included in the @variants at-rule', () => {
  const result = preGenerateUtilities([{ name: 'textAlign', handle: textAlign }], {
    textAlign: ['responsive', 'hover']
  })

  const expected = `
    @variants responsive, hover {
      .text-left { text-align: left }
      .text-right { text-align: right }
      .text-center { text-align: center }
    }
  `
  expect(result.toString()).toMatchCss(expected)
})
