import defineClasses from '../src/utils/defineClasses'
import collapseWhitespace from '../src/utils/collapseWhitespace'

it('it generate a set of helper classes from a config', () => {
  const output = defineClasses({
    flex: {
      display: 'flex'
    },
    'inline-flex': {
      display: 'inline-flex'
    }
  })

  expect(output).toBeInstanceOf(Array)
  expect(collapseWhitespace(output[0].toString())).toEqual(`.flex { display: flex }`)
  expect(collapseWhitespace(output[1].toString())).toEqual(`.inline-flex { display: inline-flex }`)
})
