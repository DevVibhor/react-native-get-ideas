import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home/Home';
import Events from './src/screens/Events/Events';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar} from 'react-native';
import colors from './src/utils/colors';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer detachPreviousScreen={false}>
          <StatusBar animated={true} backgroundColor={colors?.primaryColor} />
          <Stack.Navigator
            initialRouteName="Home"
            animationEnabled={true}
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Events" component={Events} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
