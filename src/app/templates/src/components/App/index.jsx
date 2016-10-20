import React, { PropTypes } from 'react';
import styles from './styles.scss';

export default function App({ name }) {
  return (
    <h1 className={styles.header}>
      Hello {name}!
    </h1>
  );
}

App.propTypes = {
  name: PropTypes.string.required,
};
