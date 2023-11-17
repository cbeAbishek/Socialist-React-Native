import React, { useState,useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // get the navigation object
  const [secureTextEntry, setSecureTextEntry] = useState(true); // state variable to toggle password visibility


  


  const handleLogin = async () => {
    // handle login logic here

    const url = 'http://192.168.159.216:8080/login';
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const data = new URLSearchParams();
    data.append('username', username);
    data.append('password', password);

    axios.post(url, data.toString(), config)
    .then(response => {
      console.log(response.data);
      const access_token = response.data.access_token;

          
    // Check if access_token is undefined or null
      if (access_token) {
        // Store the access_token in AsyncStorage
        AsyncStorage.setItem('access_token', access_token)
          .then(() => {
            console.log('Access token stored successfully');
            // Continue with further processing
            navigation.navigate('ProfileScreen', { name: 'John' }); // navigate to ProfileScreen
          })
          .catch((error) => {
            console.log('Error storing access token:', error);
            // Handle the error
          });
      } else {
        // Remove the access_token from AsyncStorage
        AsyncStorage.removeItem('access_token')
          .then(() => {
            console.log('Access token removed from AsyncStorage');
            // Handle the absence of the token, such as navigating to the login screen
          })
          .catch((error) => {
            console.log('Error removing access token:', error);
            // Handle the error
          });
      }
    })
    .catch(error => {
      console.log(error);
      // Handle any errors that occurred during the request
    });



  };

  const handleSignup = () => {
    navigation.navigate('SignupScreen'); // navigate to SignupScreen
  };
  
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }
  
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" 
        style={{ marginBottom: 20 }}
      >Sign In</Text>

      <TextInput
        mode="outlined"
        label="username"
        placeholder="Enter your name"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 20 }}
      />
      <TextInput
        mode="outlined"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secureTextEntry} // toggle password visibility
        right={
          <TextInput.Icon 
            icon={secureTextEntry ? 'eye-off' : 'eye'} // change icon based on password visibility
            onPress={toggleSecureEntry} // toggle password visibility on press
          />
        }
        style={{ marginBottom: 20 }}
      />

      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>

      <TouchableOpacity onPress={handleSignup}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  signupText: {
    marginTop: 20,
    alignSelf: 'center',
    color: 'blue',
    // textDecorationLine: 'underline',
  },
});

export default LoginScreen;
