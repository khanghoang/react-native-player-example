import React, { Component } from 'react';
import {
  Platform,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

export default class LoadingScreen extends Component {
  render() {
    return (
      <View style={styles.horizontal}>
        <ActivityIndicator
          animating
          style={styles.centering}
          size="large"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    flex: 1,
  },
});
