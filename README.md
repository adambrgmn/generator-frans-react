# generator-frans-react [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Scaffolds a React app with just the basic setup

## Installation

First, install [Yeoman](http://yeoman.io) and generator-frans-react using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```sh
$ npm install -g yo
$ npm install -g generator-frans-react
```

Then generate your new project:

```sh
$ yo frans-react
```

And thats all you have to do! This will scaffold a very basic setup for you to build upon.

A few npm scripts ar defined:
```sh
$ npm start           // will run webpack-dev-server with hot module reloading and stuff
$ npm test            // will run tape agains all files matching test/**/*.spec.js
$ npm run build       // will build your assets and an index-file into the build-folder
$ npm run build:stats // will do what build does, but also output some webpack stats (http://webpack.github.io/analyse/#modules)
$ npm run deploy      // will forst build your files and then deploy your site to github pages, with gh-pages
```

## File structure
```sh
.
├── src
│   ├── components
│   │   └── App
│   │       ├── index.js
│   │       └── styles.scss
│   ├── styles
│   │   └── _variables.scss
│   ├── index.js
│   └── styles.scss
├── test
│   ├── components
│   │   └── App.spec.js
│   └── setup.js
├── webpack
│   ├── htmlOptions.js
│   ├── index.ejs
│   ├── parts.js
│   ├── paths.js
│   └── polyfills.js
├── .babelrc
├── .editorconfig
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .stylelintrc
├── LICENSE
├── README.md
├── package.json
└── webpack.config.babel.js
```

## License

MIT © [Adam Bergman](http://fransvilhelm.com)


[npm-image]: https://badge.fury.io/js/generator-frans-react.svg
[npm-url]: https://npmjs.org/package/generator-frans-react
[daviddm-image]: https://david-dm.org/adambrgmn/generator-frans-react.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/adambrgmn/generator-frans-react
