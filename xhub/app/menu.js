import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ListView
} from 'react-native';
import statefulPromise from '../utils/statefulPromise';

export default class Menu extends Component {

  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
  }

  componentDidMount() {
    let promise = statefulPromise(fetch('http://awesome-xhub.herokuapp.com/getMenu')
    .then(response => {
      return response.text();
    })
    .then(data => JSON.parse(data))
    .then(data => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({
        dataSource: ds.cloneWithRows(data.menu),
      });
    })
    .catch(err => console.log(err)))

    this.forceUpdate();

    this.loadingPromise = promise;
    promise.then(() => {
      this.forceUpdate();
    })
  }

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => {
          return (
            <TouchableOpacity
            url={rowData.link}
            onPress={() => console.log(rowData.link)}
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
    backgroundColor: "#ffffff"
  },
  cell: {
    height: 40,
    fontSize: 18,
    marginLeft: 15,
  }
});