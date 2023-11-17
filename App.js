import React,{useEffect}from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Pages/LoginScreen';
import ProfileScreen from './Pages/ProfileScreen';
import SignupScreen from './Pages/SignupScreen';

const Stack = createNativeStackNavigator();

const LogoTitle = () => {
  return (
    <Image
      style={{ width: 100, height: 50 }}
      source={require('./assets/adaptive-icon.png')}
    />
  );
};

const MyStack = () => {

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Token exists, navigate to the profile screen
        navigation.replace('ProfileScreen');
        console.log("token avail")
      }
    } catch (error) {
      console.log('Error retrieving token:', error);
    }
  }





  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={LoginScreen}
          options={{
            title: 'Select one',
            headerTitle: props => <LogoTitle {...props} />,
          }}
        />
        <Stack.Screen 
        name="SignupScreen"
        component={SignupScreen} 
        options={{
          title: 'Signup',
          headerTitle: props => <LogoTitle {...props} />,
        }}
        />

        <Stack.Screen
         name="ProfileScreen" 
         component={ProfileScreen} 

         options={{
          title: 'Complains',
          headerTitle: props => <LogoTitle {...props} />,
        }}
         />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
