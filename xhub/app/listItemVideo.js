import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';

const { height, width } = Dimensions.get('window');

const item = ({ movie }) => {
  const { image, title } = movie;
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: image }}
          style={ styles.thumbImage } />
        <View style={ styles.viewTextContainer }>
          <Text style={ styles.movieTitle }>{ title }</Text>
        </View>
      </View>
    )
}

const aspect = 0.68;
const styles = StyleSheet.create({
  thumbImage: {
    height: 200,
    width: 140,
    resizeMode: 'cover'
  },

  container: {
    height: 200,
    flex: 1,
    flexDirection: 'row',
  },

  viewTextContainer: {
    flex: 1,
    height: 200,
  },

  movieTitle: {
    fontSize: 18,
    padding: 10
  }
});

export default item;
