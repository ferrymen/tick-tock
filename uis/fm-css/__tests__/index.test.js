import { resolve } from 'path'

import fmCss from '../src'

/**
 * Test index.js
 */
it('test postcss plugin', () => {
  fmCss(resolve('./fixtures/custom-config.js'))
})
