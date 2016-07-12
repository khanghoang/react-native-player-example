import React, {Component} from 'react';
import {
  StyleSheet,
  TextInput,
  Modal,
  View,
  Text,
  TouchableHighlight
} from 'react-native';
import ListVideos from './listVideos';
import Drawer from 'react-native-drawer'
import Menu from './menu';

class LockScreen extends Component {

  constructor() {
    super();
    this.state = {
      actualCode: '2704',
      currentCode: '',
      modalVisible: false
    }
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          underlayColor="#a9d9d4"
          style={{flex: 1}}
          >
            <Drawer
              type="overlay"
              tapToClose={true}
              openDrawerOffset={0.3} // 20% gap on the right side of drawer
              panCloseMask={0.5}
              panOpenMask={40}
              closedDrawerOffset={0}
              styles={styles.drawerStyles}
              tweenHandler={(ratio) => ({
                main: { opacity:(2-ratio)/2 }
              })}
              ref={(ref) => this._drawer = ref}
              content={<Menu />}
              open={true}
              negotiatePan={true}
              >
                <ListVideos />
            </Drawer>
        </Modal>
        <TextInput
          style={styles.codeInput}
          onChangeText={(currentCode) => {
            this.setState({currentCode})
            if (currentCode === this.state.actualCode) {
              this.setState({modalVisible: true})
            }
          }}
          value={this.state.currentCode}
          returnKeyType="done"
          keyboardType="numeric"
          autoFocus={true}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  codeInput: {
    textAlign: 'center',
    top: 100,
    marginLeft: 40,
    marginRight: 40,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  drawerStyles: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3
  }
});

export default LockScreen;
