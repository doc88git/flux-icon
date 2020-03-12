import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fluxIcons = (name, size) => {
  try {
    return require(`${__dirname}/dist/${name}-${size}px.vue`)
  } catch (e) {
    console.error('File not found')
  }
}

export default fluxIcons
