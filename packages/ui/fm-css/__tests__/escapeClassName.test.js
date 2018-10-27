import escapeClassName from '../src/utils/escapeClassName'

it('invalid characters are escaped', () => {
  expect(escapeClassName('u-w-1/2')).toEqual('u-w-1\\/2')
})
