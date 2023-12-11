import {combineReducers, applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

const persistConfig = {
  key: 'persist-store',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({userReducer});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
