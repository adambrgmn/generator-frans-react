import test from 'blue-tape';
import React from 'react';
import { shallow } from 'enzyme';

import App from '../../src/components/App';
import styles from '../../src/components/App/styles.scss';

test('Component: <App />', (t) => {
  const wrapper = shallow(<App name="world" />);

  {
    const should = 'Should render a <h1>-tag';
    const actual = wrapper.find(`.${styles.header}`).length;
    const expected = 1;

    t.equal(actual, expected, should);
  }

  t.end();
});
