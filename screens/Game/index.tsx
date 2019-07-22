import React, { Component, Fragment } from 'react';
import {
  Dimensions,
  TouchableOpacity,
  View,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';
import { Header } from '../../components';
import { generateRGB, mutateRGB } from '../../utilities';
import styles from './styles';
import { NavigationInjectedProps } from 'react-navigation';

interface GameState {
  points: number;
  timeLeft: number;
  size: number;
  diffTileIndex: number[];
  diffTileColor: string;
  rgb: { r: number; g: number; b: number };
  gameState: string;
}

export default class Game extends Component<
  NavigationInjectedProps,
  GameState
> {
  interval: number;
  state = {
    points: 0,
    timeLeft: 15,
    rgb: generateRGB(),
    size: 2,
    diffTileColor: '',
    diffTileIndex: [],
    gameState: 'INGAME', // three possible states: 'INGAME', 'PAUSED' and 'LOST'
  };

  componentWillMount() {
    this.generateNewRound();
    this.interval = setInterval(() => {
      if (this.state.gameState === 'INGAME') {
        if (this.state.timeLeft <= 0) {
          this.setState({ gameState: 'LOST' });
        } else {
          this.setState({
            timeLeft: this.state.timeLeft - 1,
          });
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  generateSizeIndex = (size: number) => {
    return Math.floor(Math.random() * size);
  };

  generateNewRound = () => {
    const RGB = generateRGB();
    const mRGB = mutateRGB(RGB);
    const { points } = this.state;
    const size = Math.min(Math.max(Math.floor(Math.sqrt(points)), 2), 5);
    this.setState({
      size,
      diffTileIndex: [
        this.generateSizeIndex(size),
        this.generateSizeIndex(size),
      ],
      diffTileColor: `rgb(${mRGB.r}, ${mRGB.g}, ${mRGB.b})`,
      rgb: RGB,
    });
  };

  onTilePress = (rowIndex, columnIndex) => {
    const { diffTileIndex, points, timeLeft } = this.state;
    if (rowIndex == diffTileIndex[0] && columnIndex == diffTileIndex[1]) {
      // good tile
      this.setState({
        points: points + 1,
        timeLeft: timeLeft + 2,
      });
      this.generateNewRound();
    } else {
      // wrong tile
      this.setState({ timeLeft: timeLeft - 2 });
    }
    console.log(this.state);
  };

  onBottomBarPress = async () => {
    switch (this.state.gameState) {
      case 'INGAME': {
        this.setState({ gameState: 'PAUSED' });
        break;
      }
      case 'PAUSED': {
        this.setState({ gameState: 'INGAME' });
        break;
      }
      case 'LOST': {
        await this.setState({
          points: 0,
          timeLeft: 15,
          size: 2,
        });
        this.generateNewRound();
        this.setState({
          gameState: 'INGAME',
        });
        break;
      }
    }
  };

  onExitPress = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { rgb, size, diffTileIndex, diffTileColor, gameState } = this.state;
    const { width } = Dimensions.get('window');
    const bottomIcon =
      gameState === 'INGAME'
        ? require('../../assets/icons/pause.png')
        : gameState === 'PAUSED'
        ? require('../../assets/icons/play.png')
        : require('../../assets/icons/replay.png');
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Header />
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              height: width * 0.875,
              width: width * 0.875,
              flexDirection: 'row',
            }}
          >
            {gameState === 'INGAME' ? (
              Array(size)
                .fill(null)
                .map((_val: any, columnIndex: number) => (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                    }}
                    key={columnIndex}
                  >
                    {Array(size)
                      .fill(null)
                      .map((_val: any, rowIndex: number) => (
                        <TouchableOpacity
                          key={`${rowIndex}.${columnIndex}`}
                          style={{
                            flex: 1,
                            backgroundColor:
                              rowIndex == diffTileIndex[0] &&
                              columnIndex == diffTileIndex[1]
                                ? diffTileColor
                                : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                            margin: 2,
                          }}
                          onPress={() =>
                            this.onTilePress(rowIndex, columnIndex)
                          }
                        />
                      ))}
                  </View>
                ))
            ) : (
              <View style={styles.pausedContainer}>
                {gameState === 'PAUSED' ? (
                  <Fragment>
                    <Image
                      source={require('../../assets/icons/mug.png')}
                      style={styles.pausedIcon}
                    />
                    <Text style={styles.pausedText}>COVFEFE BREAK</Text>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Image
                      source={require('../../assets/icons/dead.png')}
                      style={styles.pausedIcon}
                    />
                    <Text style={styles.pausedText}>U DED</Text>
                  </Fragment>
                )}
                <TouchableOpacity onPress={this.onExitPress}>
                  <Image
                    source={require('../../assets/icons/escape.png')}
                    style={styles.exitIcon}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={{ flex: 2 }}>
          <View style={styles.bottomContainer}>
            <View style={styles.bottomSectionContainer}>
              <Text style={styles.counterCount}>{this.state.points}</Text>
              <Text style={styles.counterLabel}>points</Text>
              <View style={styles.bestContainer}>
                <Image
                  source={require('../../assets/icons/trophy.png')}
                  style={styles.bestIcon}
                />
                <Text style={styles.bestLabel}>0</Text>
              </View>
            </View>
            <View style={styles.bottomSectionContainer}>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={this.onBottomBarPress}
              >
                <Image source={bottomIcon} style={styles.bottomIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomSectionContainer}>
              <Text style={styles.counterCount}>{this.state.timeLeft}</Text>
              <Text style={styles.counterLabel}>seconds left</Text>
              <View style={styles.bestContainer}>
                <Image
                  source={require('../../assets/icons/clock.png')}
                  style={styles.bestIcon}
                />
                <Text style={styles.bestLabel}>0</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
