import React, { Component, ReactText } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { Header } from '../../components';
import styles from './styles';
import { generateRGB, mutateRGB } from '../../utilities';

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
    diffTileIndex: [],
    diffTileColor: '',
    size: 2,
  };

  componentWillMount() {
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
            .map((_val: any, columnIndex: ReactText) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                }}
                key={columnIndex}
              >
                {Array(size)
                  .fill(null)
                  .map((_val: any, rowIndex: ReactText) => (
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
                      onPress={() => console.log(rowIndex, columnIndex)}
                    />
                  ))}
              </View>
            ))}
        </View>
      </View>
    );
  }
}
