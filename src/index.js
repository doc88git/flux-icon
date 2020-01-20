const requireModule = require.context("./assets", false, /\.svg$/);

requireModule.keys().forEach(fileName => {
  const moduleName = fileName.replace(/(\.\/|\.svg)/g, "");
  icons[moduleName] = requireModule(fileName).default;
});

export default icons;