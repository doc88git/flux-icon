const fluxIcons = (name, size) => {
  try {
    return require(`./dist/${name}-${size}px.vue`)
  } catch (e) {
    console.error('File not found')
  }
}

export default fluxIcons
