const fluxIcons = (name, size = 16) => {
  try {
    return require(`./dist/${name}-${size}px.vue`)
  } catch (e) {
    console.error('File not found')
  }
}

export default fluxIcons
