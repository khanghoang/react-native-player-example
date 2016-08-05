import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';

const { height, width } = Dimensions.get('window');

const item = ({ image, title}) => {
    return (
      <TouchableOpacity style={styles.container}>
        <Image
          source={{ uri: image }}
          style={ styles.thumbImage } />
        <View style={styles.viewTextContainer }>
          <Text>{ title }</Text>
        </View>
      </TouchableOpacity>
    )
}

const aspect = 0.68;
const styles = StyleSheet.create({
  thumbImage: {
    height: 200,
    width: height * aspect,
  },

  container: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
  },

  viewTextContainer: {
    flex: 1,
    height: 200,
  }
});

export default item;
