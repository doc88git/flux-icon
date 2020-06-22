export default (name, size) => {
  try {
    return require(`./icons/${name}-${size}px.vue`).default
  } catch (e) {
    console.error('File not found')
  }
}
