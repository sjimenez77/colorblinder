import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Header } from '../../components';
import styles from './styles';

export default class Home extends Component {
  onPlayPress = () => {
    console.log('onPlayPress event handler');
  };

  onLeaderboardPress = () => {
    console.log('onLeaderboardPress event handler');
  };

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <TouchableOpacity
          onPress={this.onPlayPress}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Image
            source={require('../../assets/icons/play_arrow.png')}
            style={styles.playIcon}
          />
          <Text style={styles.play}>PLAY!</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../assets/icons/trophy.png')}
            style={styles.trophyIcon}
          />
          <Text style={styles.hiscore}>Hi-score: 0</Text>
        </View>
        <TouchableOpacity
          onPress={this.onLeaderboardPress}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Image
            source={require('../../assets/icons/leaderboard.png')}
            style={styles.leaderboardIcon}
          />
          <Text style={styles.leaderboard}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// notice the deleted styles - they are imported from the styles.js!
