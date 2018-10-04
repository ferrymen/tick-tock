import postcss from 'postcss'
import parseObjectStyles from '../src/utils/parseObjectStyles'

function css(nodes) {
  return postcss.root({ nodes }).toString()
}

it('it parses simple single class definitions', () => {
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red'
    }
  })

  expect(css(result)).toMatchCss(`
    .foo {
      background-color: red
    }
  `)
})

it('it parses multiple class definitions', () => {
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem'
    },
    '.bar': {
      width: '200px',
      height: '100px'
    }
  })

  expect(css(result)).toMatchCss(`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem
    }
    .bar {
      width: 200px;
      height: 100px
    }
  `)
})

it('it parses nested pseudo-selectors', () => {
  const result = parseObjectStyles({
    '.foo': {
      backgroundColor: 'red',
      color: 'white',
      padding: '1rem',
      ':hover': {
        backgroundColor: 'orange'
      },
      ':focus': {
        backgroundColor: 'blue'
      }
    }
  })

  expect(css(result)).toMatchCss(`
    .foo {
      background-color: red;
      color: white;
      padding: 1rem;
    }
    .foo:hover {
      background-color: orange;
    }
    .foo:focus {
      background-color: blue;
    }
  `)
})

it('it can parse an array of styles', () => {
  const result = parseObjectStyles([
    {
      '.foo': {
        backgroundColor: 'orange'
      }
    },
    {
      '.bar': {
        backgroundColor: 'red'
      }
    },
    {
      '.foo': {
        backgroundColor: 'blue'
      }
    }
  ])

  expect(css(result)).toMatchCss(`
    .foo {
      background-color: orange
    }
    .bar {
      background-color: red
    }
    .foo {
      background-color: blue
    }
  `)
})
