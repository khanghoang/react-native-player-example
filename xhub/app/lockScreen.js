import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Modal,
  View,
  Text,
  TouchableHighlight,
  StatusBar,
	AppState, 
	PushNotificationIOS,
} from 'react-native';
import ListVideos from './listVideos';
import Drawer from 'react-native-drawer';
import Menu from './menu';
import PushNotification from 'react-native-push-notification';

class LockScreen extends Component {

  constructor() {
    super();
    this.state = {
      actualCode: '2704',
      currentCode: '',
      modalVisible: false,
    };
  }

	onNotification(notification) {
		console.log(notification.getMessage())
	}

	componentDidMount() {

		PushNotificationIOS.addEventListener("notification", this.onNotification);

		AppState.addEventListener('change', this.handleAppStateChange);

		PushNotification.configure({

			// (optional) Called when Token is generated (iOS and Android)
			onRegister: function(token) {
				console.log( 'TOKEN:', token );
			},

			// (required) Called when a remote or local notification is opened or received
			onNotification: function(notification) {
				console.log( 'NOTIFICATION:', notification );
			},

			// IOS ONLY (optional): default: all - Permissions to register.
			permissions: {
				alert: true,
				badge: true,
				sound: true
			},

			// Should the initial notification be popped automatically
			// default: true
			popInitialNotification: true,

			/**
			 * (optional) default: true
			 * - Specified if permissions (ios) and token (android and ios) will requested or not,
			 * - if not, you must call PushNotificationsHandler.requestPermissions() later
			 */
			requestPermissions: true,
		});
	}

	componentWillMount() {
		AppState.removeEventListener('change', this.handleAppStateChange);
		PushNotificationIOS.removeEventListener('notification', this.onNotification);
	}

	handleAppStateChange = (appState) => {
		if (appState === 'background' || appState === 'inactive') {
			// go back to lock screen
			this.setModalVisible(false);
			// reset code
			this.setState({ currentCode: '' });
		}
	}

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View>
        <StatusBar
          hidden
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => { alert('Modal has been closed.'); }}
          underlayColor="#a9d9d4"
          style={{ flex: 1 }}
        >
            <Drawer
              type="overlay"
              tapToClose
              openDrawerOffset={0.3} // 20% gap on the right side of drawer
              panCloseMask={0.5}
              panOpenMask={40}
              closedDrawerOffset={0}
              styles={styles.drawerStyles}
              tweenHandler={(ratio) => ({
                main: { opacity: (2 - ratio) / 2 },
              })}
              ref={(ref) => this._drawer = ref}
              content={<Menu />}
              open
              negotiatePan
            >
                <ListVideos />
            </Drawer>
        </Modal>
        <TextInput
          style={styles.codeInput}
          onChangeText={(currentCode) => {
            this.setState({ currentCode });
            if (currentCode === this.state.actualCode) {
              this.setState({ modalVisible: true });
            }
          }}
          value={this.state.currentCode}
          returnKeyType="done"
          keyboardType="numeric"
          autoFocus
        />
      </View>
    );
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
    borderWidth: 1,
  },
  drawerStyles: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});

export default LockScreen;
