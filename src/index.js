const fluxIcons = (name, size = 16) => {
  try {
    const iconFile = () => import(`./assets/${size}px/${name}-${size}px.svg`)
    return iconFile
  } catch (e) {
    console.error('File not found')
  }
}

export default fluxIcons
