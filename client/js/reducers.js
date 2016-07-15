/**
 * Created by wiltzius on 7/12/16.
 */
import {combineReducers} from 'redux';
import * as actions from './actions';
import { reducer as api } from 'redux-json-api';

const inmateSearch = (state={}, action) => {
  if(action.type == 'INMATE_SEARCH_RESULTS') {
    return Object.assign({}, state, {'inmate_ids': action.inmate_ids});
  }
  else {
    return state;
  }
};

export default combineReducers({
  api,
  inmateSearch
});
