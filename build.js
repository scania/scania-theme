const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const Fontmin = require('fontmin');
const webpack = require('webpack');
const { renderSync } = require('node-sass');

const outputFolder = 'dist';

fs.remove(outputFolder, function() {
  fs.mkdir(outputFolder, function() {
    initTheme();
    initFonts();
  });
});

function initTheme() {
  let theme = {};

  glob.sync('./src/styles/*.scss').forEach((file) => {
    const component = renderModule(file);
    theme = { ...theme, ...component };
  });

  console.log(theme);

  fs.writeFileSync(`${outputFolder}/styles.js`, `export const theme = ${ JSON.stringify(theme) };`, { flag: 'w' });

  // renderModule('./src/images/favicon.ico');
}

function initFonts() {
  const fonts = 'src/fonts/**/*.ttf';

  var fontmin = new Fontmin()
    .src(fonts)
    .use(Fontmin.glyph({
      hinting: false         // keep ttf hint info (fpgm, prep, cvt). default = true
    }))
    .use(Fontmin.ttf2woff2())
    // .use(Fontmin.css())
    .dest(outputFolder);

  fontmin.run(function(err, files) {
    if (err) {
      throw err;
    }

    glob.sync(fonts).forEach(generateCss);
    
    var compiler = webpack({
      entry: './src/fonts.js',
      mode: 'development',
      output: {
        path: path.resolve(__dirname, outputFolder),
        filename: 'fonts.js'
      },
      module: {
        rules: [
          { test: /\.css$/, loader: 'style-loader!css-loader' },
          { test: /\.(png|woff2|ttf)$/, loader: 'url-loader?limit=100000' }
        ]
      }
    });

    compiler.run(function(err, stats) {
      if (err) {
        throw err;
      }
    });
  });
}

function generateCss(file) {
  const props = path.parse(file);
  const type = props.dir.split('/').pop();
  const name = props.name
    .replace(/CY|-|Regular/g, '')
    .split(/(?=[A-Z])/).join(' ');
  const unicode = type === 'cyrillic' ? `
  unicode-range: U+0400-04FF;` : '';

  let content;

  if(props.name.indexOf('Bold') > -1) {
    content = `
  font-family: "${name.replace(' Bold', '')}";
  font-weight: bold;${
    unicode
  }`;
  } else if(props.name.indexOf('Italic') > -1) {
    content = `
  font-family: "${name.replace(' Italic', '')}";
  font-style: italic;${
    unicode
  }`;
  } else {
    content = `
  font-family: "${name}";${
    unicode
  }`;
  }

  const data = generateFontFace(file, content);

  fs.writeFileSync(`${outputFolder}/fonts.css`, data, { flag: 'a' });
}

function generateFontFace64(file, props) {
  const content = fs.readFileSync(file).toString('base64');
  return `@font-face {${
    props
  }
  src: url(data:application/font-woff2;charset=utf-8;base64,${content}) format("woff2"), /* Modern Browsers */
       url(data:font/ttf;charset=utf-8;base64,${content}) format("truetype"), /* Safari, Android, iOS 4.2+ */\n}\n`;
}

function generateFontFace(file, props) {
  const filename = file.replace(/src\/fonts\/|.ttf/g, '');
  return `@font-face {${
    props
  }
  src: url("${filename}.woff2") format("woff2"), /* Modern Browsers */
       url("${filename}.ttf") format("truetype"), /* Safari, Android, iOS 4.2+ */\n}\n`;
}

function renderModule(file) {
  const filename = path.parse(file).name.replace(/-/g, '_');
  const data = fs.readFileSync(path.resolve(file), 'utf8');
  const content = renderSync({ data: data }).css.toString();
  let obj = {};

  obj[ path.parse(file).name ] = {
    "default": content,
  };

  return obj;
}
