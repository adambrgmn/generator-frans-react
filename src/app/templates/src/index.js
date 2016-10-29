// @flow

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';
import './styles.scss';

const root = document.getElementById('root');

const renderWithHotReload = (RootElement: ReactClass<{}>) => {
  render(
    <AppContainer>
      <RootElement />
    </AppContainer>,
    root
  );
};

renderWithHotReload(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default; // eslint-disable-line
    renderWithHotReload(NextApp);
  });
}
