import {
  createStore,
  applyMiddleware,
  combineReducers,
} from 'redux';
import reducer from './reducer';

const configureStore = () => {
  const middlewares = [];
  const store = createStore(
    reducer,
    applyMiddleware(...middlewares)
  );

  return store;
};

export default configureStore;
