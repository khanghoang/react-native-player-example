import React, {Component} from 'react';
import {
  Text,
  View,
  Slider,
  StyleSheet,
  ActivityIndicatorIOS,
  InteractionManager,
  WebView,
  TouchableOpacity,
  ListView,
  Image,
  Dimensions,
  AsyncStorage,
  RefreshControl
} from 'react-native';
import _ from 'lodash';
import PlayerWrapper from '../playerWrapper';
import statefulPromise from '../utils/statefulPromise';
import LoadingScreen from './loadingScreen';
import {
  connect
} from 'react-redux';
import {
  bindActionCreators
} from 'redux';

function mapStateToProps(state) {
  return {
    menuLink: state.menuLink
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

class ListVideos extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: true
    }
  }

  componentDidMount() {
    this.onLoadData();
  }

  componentWillReceiveProps(newProps) {
    console.log('new props', newProps);
    const menuLink = newProps.menuLink;
    const url = `http://awesome-xhub.herokuapp.com/getList?url=${menuLink}`
    const url = `https://awesome-xhub.herokuapp.com/getList?url=${menuLink}`
    this.onLoadData(url);
  }

  onLoadData = (url) => {
    let finalUrl = url || 'https://awesome-xhub.herokuapp.com/getList?url=';
    let promise = statefulPromise(fetch(finalUrl)
    .then(response => {
      return response.text();
    })
    .then(data => JSON.parse(data))
    .then(data => {
      const movies = _.unionBy(data.movies, movie => movie.title);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(movies),
        refreshing: false
      });
    })
    .catch(err => console.log(err)))

    this.forceUpdate();

    this.loadingPromise = promise;
    promise.then(() => {
      this.forceUpdate();
    })
  }

  onSave = (movie) => {
    AsyncStorage.getItem('@XHUB:bookmark')
    .then(data => {
      if (data) {
        return JSON.parse(data)
      }

      return [];
    })
    .then(arrayMovies => {
      const newMovies = _.unionBy([...arrayMovies, movie], m => m.title);
      return newMovies;
    })
    .then(arrayMovies => {
      return AsyncStorage.setItem('@XHUB:bookmark', JSON.stringify(arrayMovies));
    })
    .then(() => {
      return AsyncStorage.getItem('@XHUB:bookmark');
    })
    .then((data) => {
      console.log('save data', data);
    })
    .catch(error => {
      console.log('khang error', error);
    })
  }

  onRefresh = () => {
    this.onLoadData(this.props.menuLink);
  }

  render() {

    if(this.loadingPromise && this.loadingPromise.isPending()) {
      return (
        <LoadingScreen />
      );
    }

    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            />
            }
        style={styles.fullScreen}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => {
          console.log(rowData);
          return (
            <PlayerWrapper
            url={rowData.link}
            image={rowData.image}
            onSave={this.onSave}
            movie={rowData}
            />
          );
        }}/>
    )
  }
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  cell: {
    height: width,
    width: width
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  controls: {
    backgroundColor: "transparent",
    borderRadius: 5,
    position: 'absolute',
    bottom: 44,
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
    marginBottom: 20,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListVideos);
