import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sizes = [16, 24];
const distDir = `${__dirname}/../../dist`;

const getFiles = (files, dir, size) => {
  return files.map(name => ({
    name: name.replace(`-${size}px.svg`, ''),
    size: size,
    content: fs.readFileSync(`${dir}/${name}`, 'utf8')
  }));
};

const listFiles = (directoryPath, item) => {
  return new Promise(function (resolve, reject) {
    fs.readdir(directoryPath, (err, files) => {
      if (err) return reject('Unable to scan directory: ' + err);
      let items = getFiles(files, directoryPath, item);
      resolve(items);
    });
  });
};

const cleanIconsFiles = () => {
  return new Promise(function (resolve, reject) {
    fs.readdir(`${distDir}/icons`, (err, files) => {
      if (err) return reject('Unable to scan directory: ' + err);
      files.forEach(file => {
        fs.unlink(`${distDir}/icons/${file}`, err => (err ? console.log(err) : ''));
      });
      resolve('Done!');
    });
  });
};

const getIcons = () => {
  return Promise.all(
    sizes.map(async item => {
      const size = `${item}px`;
      const directoryPath = join(__dirname, `../assets/${size}`);

      return await listFiles(directoryPath, item);
    })
  );
};

const copyIndex = () => {
  fs.copyFile(`${__dirname}/../index_dist.js`, `${distDir}/index.js`, err => {
    if (err) throw err;
    console.log('Done! index_dist.js was copied to dist/index.js');
  });
};

const createComponents = async () => {
  await cleanIconsFiles();

  getIcons().then(icons => {
    icons.forEach(size => {
      size.map(icon => {
        const fileName = `${distDir}/icons/${icon.name}-${icon.size}px.vue`;
        const content = `<template>\n${icon.content}</template>\n<script> \n export default { name: "${icon.name}" }\n</script>`;

        fs.writeFile(fileName, content, err => {
          if (err) return console.log(`File ${fileName} error!`);
        });
      });
    });

    let list = [];
    const fileName = `${distDir}/list.json`;
    icons.forEach(size => {
      size.forEach(icon => {
        list.push({ name: `${icon.name}-${icon.size}px.vue` });
      });
    });

    fs.writeFile(fileName, JSON.stringify(list, null, 2), err => {
      if (err) return console.log(`File ${fileName} error!`);
      console.log(`File list.json done!`);
    });

    copyIndex();
  });
};

createComponents();
