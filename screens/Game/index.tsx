import React, { Component } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components';
import { generateRGB, mutateRGB } from '../../utilities';
import styles from './styles';

interface GameState {
  points: number;
  timeLeft: number;
  size: number;
  diffTileIndex: number[];
  diffTileColor: string;
  rgb: { r: number; g: number; b: number };
}

export default class Game extends Component<{}, GameState> {
  interval: number;
  state = {
    points: 0,
    timeLeft: 15,
    rgb: generateRGB(),
    size: 2,
    diffTileColor: '',
    diffTileIndex: [],
  };

  componentWillMount() {
    this.generateNewRound();
    this.interval = setInterval(() => {
      this.setState(state => ({
        timeLeft: state.timeLeft - 1,
      }));
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
      this.setState({ points: points + 1, timeLeft: timeLeft + 2 });
      this.generateNewRound();
    } else {
      // wrong tile
      this.setState({ timeLeft: timeLeft - 2 });
    }
    console.log(this.state);
  };

  render() {
    const { rgb, size, diffTileIndex, diffTileColor } = this.state;
    const { width } = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <Header />
        <View
          style={{
            height: width * 0.875,
            width: width * 0.875,
            flexDirection: 'row',
          }}
        >
          {Array(size)
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
                      onPress={() => this.onTilePress(rowIndex, columnIndex)}
                    />
                  ))}
              </View>
            ))}
        </View>
      </View>
    );
  }
}
