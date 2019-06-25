const fs = require('fs');
const path = require('path');

// fix create-react-app

console.log('Fixing webpack config');
['dev.', 'prod.', ''].forEach(n => {
  let p = `../node_modules/react-scripts/config/webpack.config.${n}js`;
  try {
    fs.statSync(p);
    console.log('Processing: ' + p);

    let webpack = fs.readFileSync(p, {
      encoding: 'utf-8'
    });
    webpack = webpack.replace(/babelrc: false/g, 'babelrc: true');

    if (n === 'dev.' || n === '') {
      webpack = webpack.replace(
        'new ForkTsCheckerWebpackPlugin',
        'false && new ForkTsCheckerWebpackPlugin'
      );
    }

    fs.writeFileSync(p, webpack, {
      encoding: 'utf-8'
    });
  } catch {
    console.log('Ignored: ' + p);
  }
});

let jest = fs.readFileSync(`../node_modules/react-scripts/config/jest/babelTransform.js`, {
  encoding: 'utf-8'
});
jest = jest.replace(/babelrc: false/g, 'babelrc: true');
fs.writeFileSync(`../node_modules/react-scripts/config/jest/babelTransform.js`, jest, {
  encoding: 'utf-8'
});
