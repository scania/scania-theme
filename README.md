[![npm version](http://img.shields.io/npm/v/scania-theme.svg?style=flat&color=1081C2)](https://npmjs.org/package/scania-theme)
[![Github release](https://img.shields.io/github/v/tag/scania/scania-theme.svg?label=release&color=1081C2)](https://github.com/scania/scania-theme/releases)

# Scania Theme

Scania theme is a package to style Scania looks and feel in the [Corporate UI 4.0 setup](https://github.com/scania/corporate-ui-dev/).

## Installation

<details open>
 <summary><strong>NPM package</strong></summary>
<br/>
Install scania-theme package by running the command below.
 
```
npm i scania-theme
```

Import theme in the project and use it with addTheme function from corporate-ui.

```
import { defineCustomElements, addTheme } from 'corporate-ui-dev'; 
import { theme as scania } from 'scania-theme'; 
 
defineCustomElements(); 
addTheme(scania);
```

</details>

<details>
<summary><strong>CDN link</strong></summary>
<br/>
Add link to the script by adding the following to the head element. Make sure to include scania-theme script BEFORE the corporate-ui script.
<br/>
 
**SUBJECT TO CHANGE!**
 
```
<script src="https://static.scania.com/build/global/themes/scania/1.x/scania-theme.js"></script>
<script src="https://static.scania.com/build/global/4.x/corporate-ui/corporate-ui.js"></script>
```

Replace `x` with [available releases](https://www.npmjs.com/package/scania-theme).

</details>

## Setup in project

Initialize the theme with the `c-theme` component. Set `global` attribute to true in order to enable bootstrap styling.

```
<c-theme name="scania" global="true"></c-theme>
```

## Setup local development

1. Clone scania-theme repository

```
git clone https://github.com/scania/scania-theme.git
```

2. Download and install node.js: https://nodejs.org/en/
3. If you're behind a firewall, CONFIGURE THE PROXY
4. From the scania-theme folder, run `npm i` to install package dependencies
5. Start the local setup by running `npm start`
6. Scania theme scripts will be served on http://localhost:1338/scania-theme.js

## License

The Scania brand identity and the interaction patterns found in this repository are not available on an open source basis. Although we have great freedom to make improvements and new components, some changes to interaction patterns and use of colours etc may not be approved.
