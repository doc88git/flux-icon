import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sizes = [16];
const template = fs.readFileSync(join(__dirname, `../assets/README-TEMPLATE.md`), 'utf8')

const getFiles = (files, size) => {
  return files.map(name => ({
    name: name.replace(`-${size}px.svg`, ''),
    path_16: `./src/assets/16px/${name}`,
    path_24: `./src/assets/24px/${name.replace(16, 24)}`
  }));
};

const listFiles = (directoryPath, item) => {
  return new Promise(function(resolve, reject) {
    fs.readdir(directoryPath, (err, files) => {
      if (err) return reject('Unable to scan directory: ' + err);
      let items = getFiles(files, item);
      resolve(items);
    });
  });
};

const getIcons = () => {
  return Promise.all(
    sizes.map(async item => {
      const size = `${item}px`;
      const directoryPath = join(__dirname, `../assets/${size}`);

      return listFiles(directoryPath, item);
    })
  );
};

const writeReadMe = (content) => {
  const readmeFile = join(__dirname, `../../README.md`)

  fs.writeFile(readmeFile, content, err => {
    if (err) return console.log(`File README.md error!`);
    console.log(`File README.md done!`);
  });
}


const createComponents = async () => {
  let tableHeader = "<table>\n<tr>\n<th>Nome</th>\n<th>Icon (16px)</th>\n<th>Icon (24px)</th>\n</tr>\n"

  getIcons().then(icons => {
    icons[0].map(icon => {
      tableHeader += `<tr>\n<td>${icon.name}</td>\n<td><img src="${icon.path_16}" height="16px" width="16px"></td>\n<td><img src="${icon.path_24}" height="24px" width="24px"></td>\n</tr>\n`
    })

    tableHeader += "</table>\n"

    const content = template.replace(/<#ICONS-TABLE#>/g, tableHeader)

    writeReadMe(content)
  // let tableHeader = `| Nome | Icon (16px) | Icon (24px) | \n |------|:------:|------:|\n`

  // getIcons().then(icons => {
  //   icons[0].map(icon => {
  //     tableHeader += `| ${icon.name} | !()[${icon.path_16} =16x16] | !()[${icon.path_24} =24x24] |\n`
  //   })

  //   const content = template.replace(/<#ICONS-TABLE#>/g, tableHeader)

  //   writeReadMe(content)
  });
};

createComponents();