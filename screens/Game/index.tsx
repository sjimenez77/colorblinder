import { Audio } from 'expo-av';
import React, { Component, Fragment } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { Header } from '../../components';
import { generateRGB, mutateRGB, shakeAnimation } from '../../utilities';
import styles from './styles';

interface GameState {
  points: number;
  timeLeft: number;
  size: number;
  diffTileIndex: number[];
  diffTileColor: string;
  rgb: { r: number; g: number; b: number };
  gameState: string;
  shakeVal: Animated.Value;
}

export default class Game extends Component<
  NavigationInjectedProps,
  GameState
> {
  interval: number;
  backgroundMusic: Audio.Sound;
  buttonFX: Audio.Sound;
  tileCorrectFX: Audio.Sound;
  tileWrongFX: Audio.Sound;
  pauseInFX: Audio.Sound;
  pauseOutFX: Audio.Sound;
  loseFX: Audio.Sound;

  state = {
    points: 0,
    timeLeft: 15,
    rgb: generateRGB(),
    size: 2,
    diffTileColor: '',
    diffTileIndex: [],
    gameState: 'INGAME', // three possible states: 'INGAME', 'PAUSED' and 'LOST'
    shakeVal: new Animated.Value(0),
  };

  async componentWillMount() {
    this.generateNewRound();
    this.interval = setInterval(() => {
      if (this.state.gameState === 'INGAME') {
        if (this.state.timeLeft <= 0) {
          this.loseFX.replayAsync();
          this.backgroundMusic.stopAsync();
          this.setState({ gameState: 'LOST' });
        } else {
          this.setState({
            timeLeft: this.state.timeLeft - 1,
          });
        }
      }
    }, 1000);

    this.backgroundMusic = new Audio.Sound();
    this.buttonFX = new Audio.Sound();
    this.tileCorrectFX = new Audio.Sound();
    this.tileWrongFX = new Audio.Sound();
    this.pauseInFX = new Audio.Sound();
    this.pauseOutFX = new Audio.Sound();
    this.loseFX = new Audio.Sound();

    try {
      await this.backgroundMusic.loadAsync(
        require('../../assets/music/Komiku_BattleOfPogs.mp3'),
      );
      await this.buttonFX.loadAsync(require('../../assets/sfx/button.wav'));
      await this.tileCorrectFX.loadAsync(
        require('../../assets/sfx/tile_tap.wav'),
      );
      await this.tileWrongFX.loadAsync(
        require('../../assets/sfx/tile_wrong.wav'),
      );
      await this.pauseInFX.loadAsync(require('../../assets/sfx/pause_in.wav'));
      await this.pauseOutFX.loadAsync(
        require('../../assets/sfx/pause_out.wav'),
      );
      await this.loseFX.loadAsync(require('../../assets/sfx/lose.wav'));
      await this.backgroundMusic.setIsLoopingAsync(true);
      await this.backgroundMusic.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
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

  onTilePress = (rowIndex: number, columnIndex: number) => {
    const { diffTileIndex, points, timeLeft, shakeVal } = this.state;
    if (rowIndex == diffTileIndex[0] && columnIndex == diffTileIndex[1]) {
      // good tile
      this.tileCorrectFX.replayAsync();
      this.setState({
        points: points + 1,
        timeLeft: timeLeft + 2,
      });
      this.generateNewRound();
    } else {
      // wrong tile
      shakeAnimation(shakeVal);
      this.tileWrongFX.replayAsync();
      this.setState({ timeLeft: timeLeft - 2 });
    }
  };

  onBottomBarPress = async () => {
    switch (this.state.gameState) {
      case 'INGAME': {
        this.pauseInFX.replayAsync();
        this.setState({ gameState: 'PAUSED' });
        break;
      }
      case 'PAUSED': {
        this.pauseOutFX.replayAsync();
        this.setState({ gameState: 'INGAME' });
        break;
      }
      case 'LOST': {
        this.backgroundMusic.replayAsync();
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
    this.buttonFX.replayAsync();
    this.backgroundMusic.stopAsync();
    this.props.navigation.goBack();
  };

  render() {
    const {
      rgb,
      size,
      diffTileIndex,
      diffTileColor,
      gameState,
      shakeVal,
    } = this.state;
    const { height } = Dimensions.get('window');
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
          <Animated.View
            style={{
              height: height / 2.5,
              width: height / 2.5,
              transform: [
                {
                  translateX: shakeVal,
                },
              ],
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
          </Animated.View>
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
