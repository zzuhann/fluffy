import { combineReducers } from 'redux'
import DatingReducer from './dating'
import ProfileReducer from './profile'

export default combineReducers({
  profile: ProfileReducer,
  dating: DatingReducer,
})
