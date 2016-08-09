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
import InfiniteScrollView from 'react-native-infinite-scroll-view';

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
      refreshing: true,
      movies: [],
      isLoading: false,
      canLoadMore: true,
      page: 1,
      url: ''
    }
  }

  componentDidMount() {
    this.onLoadData();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.menuLink) {
      const menuLink = newProps.menuLink;
      if (menuLink === 'local-bookmark') {
        AsyncStorage.getItem('@XHUB:bookmark')
          .then(JSON.parse)
          .then((dataMovies) => {
            const movies = _.unionBy(dataMovies, movie => movie.title);
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({
              dataSource: ds.cloneWithRows(movies),
              refreshing: false
            });
          })
          .catch(console.log)
        return;
      }

      const url = menuLink;

      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows([]),
        refreshing: true,
        movies: [],
        isLoading: false,
        canLoadMore: true,
        page: 1
      }, () => {
        this.onLoadData(url);
      });
    }
  }

  onLoadData = (url = this.state.url) => {
    let finalUrl = `https://awesome-xhub.herokuapp.com/getList?url=${url}&page=${this.state.page}`;

    this.setState({
      url,
      isLoading: true
    });

    let promise = statefulPromise(fetch(finalUrl)
    .then(response => {
      return response.text();
    })
    .then(data => JSON.parse(data))
    .then(data => {

      // no more movies
      if (data.movies.length === 0) {
        this.setState({
          canLoadMore: false
        });
      }

      const movies = _.unionBy([...this.state.movies, ...data.movies], movie => movie.title);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(movies),
        refreshing: false,
        movies: movies,
        isLoading: false,
        page: this.state.page + 1
      });
    })
    .catch(err => console.log(err)))

    this.forceUpdate();

    return promise;
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
    this.onLoadData(this.props.menuLink, true);
  }

  onLoadMore = () => {
    return this.onLoadData();
  }

  canLoadMore = () => {
    return !this.state.isLoading && this.state.canLoadMore;
  }

  render() {

    if(this.loadingPromise && this.loadingPromise.isPending()) {
      return (
        <LoadingScreen />
      );
    }

    return (
      <ListView
        renderScrollComponent={props => <InfiniteScrollView {...props} />}
        refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          />
        }
        distanceToLoadMore={1000}
        style={styles.fullScreen}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => {
          return (
            <PlayerWrapper
            url={rowData.link}
            image={rowData.image}
            onSave={this.onSave}
            movie={rowData}
            />
          );
        }}
        canLoadMore={this.canLoadMore}
        onLoadMoreAsync={this.onLoadMore}
        />
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
