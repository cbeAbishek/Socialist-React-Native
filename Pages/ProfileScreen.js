import React,{useState,useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation, Avatar, Menu, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ComplainList from './ComplainList';
import CreateComplain from './CreateComplain'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Tab = createBottomTabNavigator();

export default function ProfileScreen() {

  const [userData, setUserData] = useState({});
  const [menuVisible, setMenuVisible] = useState(false);




  useEffect(() => {
    // Retrieve the access_token from AsyncStorage
    AsyncStorage.getItem('access_token')
      .then((token) => {
        if (!token) {
          // Token does not exist in AsyncStorage
          // Navigate to the login screen
          navigation.navigate('SignupScreen');
        } else {
          // Token exists in AsyncStorage
          console.log('Access token:', token);
          // You can use the token for further processing

          const url = 'http://192.168.159.216:8080/users/me';

          const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          };

          axios.get(url, config)
            .then(response => {
              console.log(response.data);
              // Process the response data here
              setUserData(response.data);

            })
            .catch(error => {
              console.log(error);
              // Handle any errors that occurred during the request
            });
    
        }
      })
      .catch((error) => {
        // Handle any errors that occurred during retrieval
        console.log('Error retrieving access token:', error);
      });
  }, []);


  return (
    <Provider>

 
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
         
      <Tab.Screen
        name="Home"
        component={CreateComplain}
        options={{
          tabBarLabel: 'Create Compliant',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={ComplainList}
        options={{
          tabBarLabel: 'Complaints',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>

    </Provider>
    );
}



const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
