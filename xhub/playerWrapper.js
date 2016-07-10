import Player from './player';
import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  Slider,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  Dimensions
} from 'react-native';

export default class PlayerWrapper extends Component {

  constructor() {
    super();
    this.state = {
      movieDirectURL: null,
      onPlay: false
    }
  }

  onPress = () => {

    this.setState({
      onPlay: !this.state.onPlay
    });

    if (this.state.movieDirectURL) {
      return;
    }

    const remote = `http://awesome-xhub.herokuapp.com/getMovie?url=`;

    fetch(`${remote}${this.props.url}`)
    .then(response => {
      return response.text();
    })
    .then(data => JSON.parse(data))
    .then(data => {
      this.setState({
        movieDirectURL: data.movie[0].file
      })
    })
    .catch(err => console.log(err))
  }

  render() {
    if (this.state.onPlay && this.state.movieDirectURL) {
      return (
        <TouchableOpacity>
          <Player
            onCancel={this.onPress}
            movieDirectURL={this.state.movieDirectURL}
            />
          </TouchableOpacity>
      )
    }

    console.log(this.props);

    return (
      <TouchableOpacity onPress={this.onPress}>
        <Image
          source={{uri: this.props.image}}
          style={styles.cell} />
      </TouchableOpacity>
    )
  }
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  cell: {
    height: width,
    width: width,
    flex: 1
  }
});
