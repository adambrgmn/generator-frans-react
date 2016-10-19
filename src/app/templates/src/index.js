import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import './styles.scss';

render(
  <App name="world" />,
  document.getElementById('root')
);