import Player from './player';
import React, { Component } from 'react';
import ListItemVideo from './app/listItemVideo';
import {
  AppRegistry,
  Text,
  View,
  Slider,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  Dimensions,
} from 'react-native';
import _ from 'lodash';

export default class PlayerWrapper extends Component {

  constructor() {
    super();
    this.state = {
      movieDirectURL: null,
      onPlay: false,
      isLoading: false,
    };
  }

  onPress = () => {
    this.setState({
      onPlay: !this.state.onPlay,
      isLoading: true,
    });

    if (this.state.movieDirectURL) {
      return;
    }

    const remote = 'https://awesome-xhub.herokuapp.com/getMovie?url=';

    fetch(`${remote}${this.props.url}`)
      .then(response => {
        return response.text();
      })
      .then(data => JSON.parse(data))
      .then(data => {
        const url = _.last(data.movie).file;
        this.setState({
          movieDirectURL: _.last(data.movie).file,
          isLoading: false,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.onPlay && this.state.movieDirectURL) {
      return (
        <TouchableOpacity>
          <Player
            onCancel={this.onPress}
            movieDirectURL={this.state.movieDirectURL}
            {...this.props}
          />
          </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={this.onPress}>
         <ListItemVideo movie={this.props.movie} isLoading={this.state.isLoading} />
      </TouchableOpacity>
    );
  }
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  cell: {
    height: width,
    width,
    flex: 1,
  },
});
