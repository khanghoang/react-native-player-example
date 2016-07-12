import {
  SELECT_MENU_ITEM
} from './action';
import _ from 'lodash';

export default function(state = {}, action) {
  switch(action.type) {
    case SELECT_MENU_ITEM: {
      return _.assign(
        {},
        state,
        {menuLink: action.data}
      )
    }
    default:
      return state;
  }
}
