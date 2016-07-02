/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  Text,
  View,
  Slider,
  StyleSheet,
  ActivityIndicatorIOS,
  InteractionManager,
  WebView
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';
import _ from 'lodash';
import Video from "react-native-video";

class xhub extends Component {

  constructor() {
    super();
  }

  componentDidMount() {
    fetch('http://awesome-xhub.herokuapp.com/getMovie?url=http://xonline.tv/watch-tek-080-thick-kiss-sex-mikami-yua-that-caramel-saliva-2026.html')
    .then(response => response._bodyText)
    .then(JSON.parse)
    .then(data => {
      console.log(data);
      this.setState({
        movieDirectURL: data.movie[0].file
      })
    })
    .catch(console.log)
  }

  onValueChange(value) {
    let duration = _.get(this, "state.duration");
    if(duration) {
      this.refs.videoPlayer.seek(value * this.state.duration);
    }
  }

  onLoad(videoDetails) {
    this.setState({
      duration: videoDetails.duration
    });
  }

  setTime(videoDetails) {
    this.setState({
      currentTime: videoDetails.currentTime
    });
  }

  videoError(info) {
    console.log(info);
  }

  render() {

    if(_.get(this, 'state.movieDirectURL')) {
      return (
        <View style={{flex: 1, backgroundColor: "white"}}>
          <Video source={{uri: this.state.movieDirectURL}}
            rate={1.0}
            volume={1.0}
            muted={false}
            paused={false}
            onLoadStart={this.loadStart}
            onLoad={this.onLoad.bind(this)}
            onProgress={this.setTime.bind(this)}
            onEnd={this.onEnd}
            onError={this.videoError.bind(this)}
            style={styles.backgroundVideo}
            ref="videoPlayer"
          />
          <View style={{position: "relative", height: 20, flex: 1, bottom: 20, backgroundColor: 'rgba(0,0,0,0)'}}>
            <Slider 
              style={styles.slider} 
              onValueChange={this.onValueChange.bind(this)} 
            />
          </View>
        </View>
      )
    }

    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  webview: {
    flex: 1,
    opacity: 0
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  slider: {
    height: 10,
    flex: 1,
    bottom: 0,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  backgroundVideo: {
    position: 'absolute',
    backgroundColor: '#000000',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1
  }
});

AppRegistry.registerComponent('xhub', () => xhub);
