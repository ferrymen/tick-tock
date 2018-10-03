import postcss from 'postcss'

export default postcss.plugin('fm-css', opts => {
  console.log(opts)
  return postcss([])
})
