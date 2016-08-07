import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';

const { height, width } = Dimensions.get('window');

const item = ({ movie, isLoading}) => {
  const { image, title } = movie;
    return (
      <View style={styles.container}>
        <View style={ styles.containerWrapper }>
          <Image
            source={{ uri: image }}
            style={ styles.thumbImage } />
            {
              isLoading &&
              <ActivityIndicator style={ styles.loadingIndicator } animating={true} size='large'/>
            }
        </View>
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
    resizeMode: 'cover',
  },

  containerWrapper: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
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
  },

  loadingIndicator: {
    ...StyleSheet.absoluteFillObject
  },

  centering: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default item;
