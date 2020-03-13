export default (name, size) => {
  try {
    return import(`./dist/${name}-${size}px.vue`)
  } catch (e) {
    console.error('File not found')
  }
}
