import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../auth/LoginScreen';
import { AuthContext } from '../context/AuthContext';
import AeroclubScreen from '../aeroclubScreen';
import MapScreen from '../mapScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const auth = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        {auth?.userToken ? (
          <>
            <Tab.Screen name="Aeroclub" component={AeroclubScreen} />
            <Tab.Screen name="Mapa" component={MapScreen} />
          </>
        ) : (
          <Tab.Screen name="Login" component={LoginScreen} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;