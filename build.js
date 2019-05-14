const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const Fontmin = require('fontmin');

const { renderSync } = require('node-sass');

fs.removeSync('dist');

fs.mkdirSync('dist');

initTheme();

initFonts();

function initTheme() {
  glob.sync('./src/*.scss').forEach(renderModule);

  // renderModule('./src/assets/favicon.ico');
}

function initFonts() {
  const fonts = 'src/assets/fonts/**/*.ttf';

  var fontmin = new Fontmin()
    .src(fonts)
    .use(Fontmin.glyph({
      hinting: false         // keep ttf hint info (fpgm, prep, cvt). default = true
    }))
    .use(Fontmin.ttf2woff2())
    // .use(Fontmin.css())
    .dest('dist/fonts');
  
  fontmin.run(function(err, files) {
    if (err) {
      throw err;
    }
  
    glob.sync(fonts).forEach(generateCss);
  });
}

function generateCss(file) {
  const props = path.parse(file);
  const type = props.dir.split('/').pop();
  const name = props.name
    .replace(/CY|-|Regular/g, '')
    .split(/(?=[A-Z])/).join(' ');
  const filename = file.replace(/src\/assets\/|.ttf/g, '');
  const unicode = type === 'cyrillic' ? `
  unicode-range: U+0400-04FF;` : '';

  let content = '';

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

  const data = generateFontFace(filename, content);

  fs.writeFileSync(`dist/${type}.css`, data, { flag: 'a' });
}

function generateFontFace(file, props) {
  return `@font-face {${
    props
  }
  src: url("${file}.woff2") format("woff2"), /* Modern Browsers */
       url("${file}.ttf") format("truetype"), /* Safari, Android, iOS 4.2+ */\n}\n`;
}

function renderModule(file) {
  const filename = path.parse(file).name.replace('-', '_');
  const content = convertContent(file);

  fs.writeFileSync('dist/theme.ts', `export const ${filename} = \`\n${content}\`;\n\n`, { flag: 'a' });
}

function convertContent(file) {
  const extension = path.parse(file).ext;
  let data = fs.readFileSync(file);
  let content;

  switch(extension) {
    case '.scss':
      data = fs.readFileSync(path.resolve(file), 'utf8');
      content = renderSync({ data: data }).css;
      break;
    case '.ico':
      content = data.toString('base64');
      break;
    default:
      content = data;
  }

  return content;
}
