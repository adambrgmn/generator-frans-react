import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';

export default class App extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { userInfo: undefined };
  }

  componentDidMount() {
    const getUserInfo = async (username) => {
      try {
        const data = await fetch(`https://api.github.com/users/${username}`);
        const json = await data.json();

        return json;
      } catch (err) {
        throw err;
      }
    };

    getUserInfo(this.props.username)
      .then((userInfo) => {
        this.setState({ userInfo });
      })
      .catch((err) => {
        this.setState({ userInfo: err.message });
      });
  }

  render() {
    const { userInfo } = this.state;

    if (!userInfo) {
      return (
        <h1 className={styles.header}>Loading data...</h1>
      );
    }

    return (
      <div>
        <img src={userInfo.avatar_url} alt="Avatar" />
        <pre>{JSON.stringify(userInfo, null, 2)}</pre>
      </div>
    );
  }
}
