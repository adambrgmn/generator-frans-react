import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';

export default class App extends Component {
  static propTypes = {
    username: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = { userInfo: undefined };

    this.getUserInfo = this.getUserInfo.bind(this);
    this.getUserInfo(props.username || 'octocat')
      .catch((err) => {
        this.setState({ userInfo: err });
      });
  }

  async getUserInfo(username) {
    try {
      const data = await fetch(`https://api.github.com/users/${username}`);
      const json = await data.json();

      return this.setState({ userInfo: json });
    } catch (err) {
      throw err;
    }
  }

  render() {
    const { userInfo } = this.state;

    if (!userInfo) {
      return (
        <div className={styles.container}>
          <h1 className={styles.header}>Loading data...</h1>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <h1 className={styles.header}>{userInfo.login}</h1>
        <img className={styles.image} src={userInfo.avatar_url} alt={`Gravatar for ${userInfo.login}`} />
        <pre className={styles.code}>{JSON.stringify(userInfo, null, 2)}</pre>
      </div>
    );
  }
}
