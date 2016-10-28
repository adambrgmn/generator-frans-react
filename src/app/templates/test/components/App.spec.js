import test from 'blue-tape';
import React from 'react';
import { shallow } from 'enzyme';

import App from '../../src/components/App';
import styles from '../../src/components/App/styles.scss';

test('Component: <App />', (t) => {
  const wrapper = shallow(<App />);

  {
    const should = 'Should initially render an .input-tag';
    const actual = wrapper.find(`.${styles.input}`).length;
    const expected = 1;

    t.equal(actual, expected, should);
  }

  {
    wrapper.setState({ user: { login: 'test', avatar_url: 'http://test.com/test.jpg' } });

    const should = 'Should render a .header-tag after setState';
    const actual = wrapper.find(`.${styles.header}`).length;
    const expected = 1;

    t.equal(actual, expected, should);
  }

  t.end();
});
