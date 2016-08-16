/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import LockScreen from './app/lockScreen';
import { Provider } from 'react-redux';
import createStore from './createStore';

const store = createStore();

const Main = () => {
  return (
    <Provider store={store}>
      <LockScreen />
    </Provider>
  );
};

AppRegistry.registerComponent('xhub', () => Main);
