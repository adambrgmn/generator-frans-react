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

And that is all you have to do! This will scaffold a very basic setup for you to build upon.

A few npm scripts are defined:
```sh
$ npm start           # will run a Webpack dev server with hot module reloading and stuff
$ npm test            # will run tape agains all files matching 'test/**/*.spec.js'
$ npm run watch       # will watch for updates in src/ and test/ and rerun tests every time
$ npm run build       # will build your assets and an index-file into the build-folder
$ npm run deploy      # will first build your files and then deploy your site to github pages, with [gh-pages](https://github.com/tschaub/gh-pages)
```

## What is included
This is a very basic setup. Only [React](https://facebook.github.io/react/) and [ReacDOM](https://facebook.github.io/react/docs/react-dom.html) are included as dependencies. And I presume that you have some knowledge of it before you start developing.

The interesting parts are the development dependencies. It is a list of highly opinionated modules – inspired in a lot of ways by Facebooks [create-react-app](https://github.com/facebookincubator/create-react-app) – that work together in a way that at least suits me. Hopefully it will do the same for you.

### Webpack
[Webpack](https://github.com/webpack/webpack) is used as a module bundler tying together all the loose modules. It is setup so that you even can `import` images, videos and fonts.

```js
import cat from './img/cat.png';
import unicornJumping from './video/unicorn-jumping.mp4';
// and so on...
```

### ES2015 →
Thanks to [Babel](https://babeljs.io/) the code gets compiled from your awesome future javascript to legible code that the not so modern browsers can understand.

Some plugins also provide some extra stuff for you to work with:

- `babel-plugin-transform-class-properties`
```js
class MyClass {
  handleClick = () => this.setState({ clicked: true });
}
```
- `babel-plugin-transform-object-rest-spread`
```js
const obj1 = { prop1: 'Hello', prop2: 'world!' };
const obj2 = { ...obj1, prop3: 'How do you do?'};
```
- `babel-plugin-transform-transform-regenerator`
```js
function* myGenerator() {
  yield 1;
  yield 2;
}
```
- `babel-plugin-transform-transform-runtime`
```js
// Polyfills the runtime needed for async/await and generators
async function myAsyncFunction() {
  const hello = await fetch('http://hello.com/api');
  return hello;
}
```

### SASS and CSS Modules
This generator enables [SASS]('http://sass-lang.com/') together with [CSS Modules](https://github.com/css-modules/css-modules). This way you can write locally scoped css rules and use them in you js.

```css
$color: #bada55;
.header { color: $color; }
```
```js
// ...
import styles from './styles.scss';
export default function Header({ title }) {
  return (
    <h1 className={styles.header}>{title}</h1> // This will give you a class like this: styles__header___3vyxV
  );
}
```

### Tests
The tests are run by [tape](https://github.com/substack/tape). Together with [Enzyme](https://github.com/airbnb/enzyme) they make a simple, yet powerful, couple.

```js
import test from 'blue-tape'; // blue-tape makes tape a little better. Look it up
import React from 'react';
import { shallow } from 'enzyme';

import Header from '../../src/components/Header';
import styles from '../../src/components/Header/styles.scss';

test('Component: <Header />', (t) => {
  const wrapper = shallow(<Header title="world" />);

  const should = 'Should render a <h1>-tag';
  const actual = wrapper.find(`.${styles.header}`).length;
  const expected = 1;

  t.equal(actual, expected, should);
  t.end();
});
```

Run your tests with `npm test` (or `npm run watch` to rerun on updates).

### Lint
[Eslint](http://eslint.org/) and [Stylelint](http://stylelint.io/) work their magic on their front.


## IMPORTANT NOTES
### Hot reloading
A while back [react-hot-loader](https://github.com/gaearon/react-hot-loader) released a beta of v3. For it to work it is important that you always keep the code in `src/index.js` as it is when you develop the app. Otherwise hot reloading will not work.

```js
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';
import './styles.scss';

const root = document.getElementById('root');

const renderWithHotReload = (RootElement) => {
  render(
    <AppContainer> // The AppContainer component must always be present
      <RootElement />
    </AppContainer>,
    root
  );
};

renderWithHotReload(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default;
    renderWithHotReload(NextApp);
  });
}
```

Though you can of course do this if you want to include i.e. Redux:

```js
import { Provider } from 'redux';
import store from './store';
// ...
const renderWithHotReload = (RootElement) => {
  render(
   <AppContainer>
     <Provider store={store}>
       <RootElement />
     </Provider>
   </AppContainer>,
   root
  );
};
// ...
```

## File structure
```
.
├── node_modules
├── build
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── components
│   │   └── App
│   │       ├── index.js
│   │       └── styles.scss
│   ├── styles
│   │   └── _variables.scss
│   ├── index.js
│   └── styles.scss
├── test
│   ├── components
│   │   └── App.spec.js
│   └── setup.js
├── webpack
│   ├── build.js
│   ├── paths.js
│   ├── polyfills.js
│   ├── start.js
│   ├── utils.js
│   ├── webpack.config.dev.js
│   └── webpack.config.prod.js
├── .babelrc
├── .editorconfig
├── .eslintrc
├── .gitignore
├── .stylelintrc
├── LICENSE
├── README.md
└── package.json
```

## License
MIT © [Adam Bergman](http://fransvilhelm.com)


[npm-image]: https://badge.fury.io/js/generator-frans-react.svg
[npm-url]: https://npmjs.org/package/generator-frans-react
[daviddm-image]: https://david-dm.org/adambrgmn/generator-frans-react.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/adambrgmn/generator-frans-react
