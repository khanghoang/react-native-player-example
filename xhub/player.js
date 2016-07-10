import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  Slider,
  StyleSheet,
  ActivityIndicatorIOS,
  InteractionManager,
  WebView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import _ from 'lodash';
import Video from "react-native-video";

export default class Player extends Component {

  constructor() {
    super();
    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      controls: false,
      paused: false,
      skin: 'custom',
      movieDirectURL: null
    };
  }

  onProgress = (data) => {
    this.setState({currentTime: data.currentTime});
  }

  onLoad = (videoDetails) => {
    this.setState({
      duration: videoDetails.duration
    });
  }

  renderCloseControl() {
    return (
      <Text
        onPress={() => {
          this.props.onCancel();
        }}
        style={[styles.closeButton, {fontWeight: "bold", backgroundColor: "#fff", alignSelf: 'flex-end', paddingTop: 5, paddingRight: 10, paddingLeft: 10, paddingBottom: 5}]}
        >
          Close
        </Text>
    );
  }

  renderRateControl(rate) {
    const isSelected = (this.state.rate == rate);

    return (
      <TouchableOpacity onPress={() => { this.setState({rate: rate}) }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
          {rate}
        </Text>
      </TouchableOpacity>
    )
  }

  renderResizeModeControl(resizeMode) {
    const isSelected = (this.state.resizeMode == resizeMode);

    return (
      <TouchableOpacity onPress={() => { this.setState({resizeMode: resizeMode}) }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
          {resizeMode}
        </Text>
      </TouchableOpacity>
    )
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  }

  renderVolumeControl(volume) {
    const isSelected = (this.state.volume == volume);

    return (
      <TouchableOpacity onPress={() => { this.setState({volume: volume}) }}>
        <Text style={[styles.controlOption, {fontWeight: isSelected ? "bold" : "normal"}]}>
          {volume * 100}%
        </Text>
      </TouchableOpacity>
    )
  }

  renderCustomSkin() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

    return (
      <View style={styles.cell}>
        <TouchableOpacity style={styles.fullScreen} onPress={() => {this.setState({paused: !this.state.paused})}}>
          <Video
            ref='videoPlayer'
            source={{uri:this.props.movieDirectURL}}
            style={styles.fullScreen}
            rate={this.state.rate}
            paused={this.state.paused}
            volume={this.state.volume}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            onLoad={this.onLoad}
            onProgress={this.onProgress}
            onEnd={() => { AlertIOS.alert('Done!') }}
            repeat={true}
          />
        </TouchableOpacity>

        {this.renderCloseControl()}

        <View style={styles.controls}>
          <View style={styles.trackingControls}>
            <View style={styles.progress}>
              <Slider
                style={styles.slider}
                onValueChange={_.debounce(this.onValueChange, 200)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  onValueChange = (value) => {
    let duration = _.get(this, "state.duration");
    if(duration) {
      this.refs.videoPlayer.seek(value * this.state.duration);
    }
  }

  render() {
    return this.renderCustomSkin();
  }
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  cell: {
    height: width,
    width: width,
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controls: {
    backgroundColor: "transparent",
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
    left: 4,
    right: 4,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingBottom: 10,
  },
  skinControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: "white",
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
  nativeVideoControls: {
    top: 184,
    height: 300
  },
  slider: {
    height: 10,
    flex: 1,
    bottom: 0,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 0,
  },
  closeButton: {
    marginTop: 10,
    marginRight: 20,
    height: 30,
    alignSelf: "flex-start"
  }
});
