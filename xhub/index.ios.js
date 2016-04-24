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
import data from "data";

class xhub extends Component {

  constructor() {
    super();
    this.onBridgeMessage = this.onBridgeMessage.bind(this);
  }

  componentDidMount() {
    this.refs.webview.reload();
  }

  onBridgeMessage(url) {
    console.log(url);
    this.setState({
      movieDirectURL: url
    });
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

    const injectScript = `
    function webViewBridgeReady(cb) {
      //checks whether WebViewBirdge exists in global scope.
      if (window.WebViewBridge) {
        cb(window.WebViewBridge);
        return;
      }

      function handler() {
        //remove the handler from listener since we don't need it anymore
        document.removeEventListener('WebViewBridge', handler, false);
        //pass the WebViewBridge object to the callback
        cb(window.WebViewBridge);
      }

      //if WebViewBridge doesn't exist in global scope attach itself to document
      //event system. Once the code is being injected by extension, the handler will
      //be called.
      document.addEventListener('WebViewBridge', handler, false);
    }

    webViewBridgeReady(function (webViewBridge) {
      webViewBridge.onMessage = function (message) {
        // on message from native
      };

      var directURL = player.src({
        type: vt,
        src: vs
      }).K.src;
      var videoPlayer = document.createElement("video");
      videoPlayer.src = directURL;
      videoPlayer.controls = true;

      var oldBody = document.body;
      var newBody = document.createElement("body");
      oldBody.parentNode.replaceChild(newBody, oldBody);

      var mainDiv = document.body;
      mainDiv.appendChild(videoPlayer);
      videoPlayer.play();

      webViewBridge.send(directURL);
    });

    `;

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
      <WebViewBridge
        ref="webview"
        style={styles.webview}
        source={{uri: url}}
        startInLoadingState={true}
        onBridgeMessage={this.onBridgeMessage}
        injectedJavaScript={injectScript}
        >
      </WebViewBridge>
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
