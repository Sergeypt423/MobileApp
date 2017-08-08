import { combineReducers } from 'redux';
import { reducer as usersReducer } from './users/reducer';
import { reducer as tempReducer } from './Temp/reducer';

export const reducer = combineReducers({
	users: usersReducer,
	temp: tempReducer,
});
