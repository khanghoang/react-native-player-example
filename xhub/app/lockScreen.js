import React, {
  Component,
  StyleSheet,
  TextInput,
  Modal,
  View,
  Text,
  TouchableHighlight
} from 'react-native';
import ListVideos from './listVideos';

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
          >
            <ListVideos />
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
  }
});

export default LockScreen;
