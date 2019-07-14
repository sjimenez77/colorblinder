import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import React, { Component, Fragment } from 'react';
import { StatusBar } from 'react-native';
import Routes from './screens/Routes';

class App extends Component {
  state = {
    isFontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      dogbyte: require('./assets/fonts/dogbyte.otf'),
    });
    this.setState({ isFontLoaded: true });
  }

  render() {
    if (!this.state.isFontLoaded) {
      return <AppLoading />;
    } else {
      return (
        <Fragment>
          <StatusBar barStyle="light-content" />
          <Routes />
        </Fragment>
      );
    }
  }
}

export default App;
