import defineClass from '../src/utils/defineClass'
import collapseWhitespace from '../src/utils/collapseWhitespace'

it('create a proper single-word class witch rules', () => {
  const output = defineClass('flex', { display: 'flex' })
  expect(collapseWhitespace(output.toString())).toEqual('.flex { display: flex }')
})

it('escapes non-standard characters in selectors', () => {
  let output = defineClass('u-w-1/4', { width: '25%' })
  expect(collapseWhitespace(output.toString())).toEqual(`.u-w-1\\/4 { width: 25% }`)
})
