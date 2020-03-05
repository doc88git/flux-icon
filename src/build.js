import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sizes = [16, 24];

const getFiles = (files, dir, size) => {
  return files.map(name => ({
    name: name.replace(`-${size}px.svg`, ''),
    size: size,
    content: fs.readFileSync(`${dir}/${name}`, 'utf8')
  }));
};

const listFiles = (directoryPath, item) => {
  return new Promise(function(resolve, reject) {
    fs.readdir(directoryPath, (err, files) => {
      if (err) return reject('Unable to scan directory: ' + err);
      let items = getFiles(files, directoryPath, item);
      resolve(items);
    });
  });
};

const getIcons = () => {
  return Promise.all(
    sizes.map(async item => {
      const size = `${item}px`;
      const directoryPath = join(__dirname, `assets/${size}`);

      return await listFiles(directoryPath, item);
    })
  );
};

const createComponents = () => {
  getIcons().then(icons => {
    icons[0].map(icon => {
      const fileName = `${__dirname}/dist/${icon.name}-${icon.size}`
      const content = `${icon.content}`

      fs.writeFile(fileName, content, (err) => {
        if (err) return console.log(`File ${fileName} error!`);
        console.log(`File ${fileName} done!`);
      });
    })
  })
};

createComponents()
