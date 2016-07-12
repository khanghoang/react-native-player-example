import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  RefreshControl
} from 'react-native';
import {
  selectMenuItem
} from '../action';
import {
  connect
} from 'react-redux';
import {
  bindActionCreators
} from 'redux';
import statefulPromise from '../utils/statefulPromise';

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    selectMenuItem
  }, dispatch);
}


class Menu extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: true,
    }

    this.menu = [{title: 'Bookmark', link: 'local-bookmark'}]
  }

  componentDidMount() {
    this.onLoadData();
  }

  onLoadData = () => {
    let promise = statefulPromise(
      fetch('https://awesome-xhub.herokuapp.com/getMenu')
      .then(response => {
        return response.text();
      })
      .then(data => JSON.parse(data))
      .then(data => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const newMenu = [...this.menu, ...data.menu];
        console.log(newMenu);
        this.setState({
          dataSource: ds.cloneWithRows(newMenu),
          refreshing: false
        });
        return data.menu;
      })
      .then(menu => {
        return AsyncStorage.setItem('@XHUB:menu', JSON.stringify(menu))
      })
      .catch(err => console.log(err))
    )

    this.forceUpdate();

    this.loadingPromise = promise;
    promise.then(() => {
      this.forceUpdate();
    })
  }

  render() {
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onLoadData}
          />
        }
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => {
          return (
            <TouchableOpacity
            url={rowData.link}
            onPress={() => this.props.selectMenuItem(rowData.link)}
            >
            <Text
            style={styles.cell}
            >
            {rowData.title}
            </Text>
            </TouchableOpacity>
          );
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20
  },
  cell: {
    height: 40,
    fontSize: 18,
    marginLeft: 15,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
