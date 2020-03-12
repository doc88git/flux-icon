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

const cleanDist = () => {
  return new Promise(function(resolve, reject) {
    const distDir = `${__dirname}/dist`;
    fs.readdir(distDir, (err, files) => {
      if (err) return reject('Unable to scan directory: ' + err);
      files.forEach(file => {
        fs.unlink(`${distDir}/${file}`, err => (err ? console.log(err) : ''));
      });
      resolve('Done!');
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

const createComponents = async () => {
  await cleanDist();

  getIcons().then(icons => {
    icons.forEach(size => {
      size.map(icon => {
        const fileName = `${__dirname}/dist/${icon.name}-${icon.size}px.vue`;
        const content = `<template>\n${icon.content}</template>\n<script>\nexport default {name: "${icon.name}"}\n</script>`;

        fs.writeFile(fileName, content, err => {
          if (err) return console.log(`File ${fileName} error!`);
          console.log(`File ${fileName} done!`);
        });
      });
    });
  });
};

createComponents();
