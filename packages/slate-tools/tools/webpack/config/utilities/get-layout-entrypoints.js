const fs = require('fs');
const path = require('path');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

module.exports = function() {
  const entrypoints = {};
  const layoutPath = config.get('paths.theme.src.layouts');

  fs.readdirSync(layoutPath, {withFileTypes: true}).forEach((file) => {
    let namedFile;

    if (fs.statSync(path.join(layoutPath, file)).isDirectory()) {
      namedFile = path.join(layoutPath, file, `${file}.liquid`);
    } else {
      namedFile = path.join(layoutPath, `${file}.liquid`);
    }

    if (fs.existsSync(namedFile)) {
      entrypoints[`layout.${file}`] = namedFile;
    }
  });
  return entrypoints;
};
