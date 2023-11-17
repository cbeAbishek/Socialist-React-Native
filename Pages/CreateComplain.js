import React, { useState,useEffect } from 'react';
import { View, StyleSheet,Text, Image,ScrollView,TouchableOpacity  } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BottomNavigation, Avatar, Menu, Divider, Provider } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';


const CreateComplaint = () => {
  const [problem, setProblem] = useState('');
  const [landmark, setLandmark] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [district, setDistrict] = useState('');
  const [userData, setUserData] = useState({});
  const navigation = useNavigation(); // get the navigation object

  const [menuVisible, setMenuVisible] = useState(false);


  const handleLogout = async () => {
    try {
      // Remove the access_token from AsyncStorage
      await AsyncStorage.removeItem('access_token');
      // Navigate to the login screen
      navigation.navigate('SignupScreen');

    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

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
              console.log("eeeeee", response.data);
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

  const handleSelectImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
      if (result.type === 'success') {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleCreateComplaint = () => {
    // handle create complaint logic here
    const complaint = {
      name : "demo",
      problem_statement: problem,
      landmark: landmark,
      phone: mobile,
      district: district,
      image: selectedImage, // Pass the image URI directly
    };
    
    console.log(complaint)

    const url = `http://192.168.159.216:8080/users/${userData.id}/problems`;
    const config = {
        'Content-type': 'application/json'
    };

  axios
    .post(url,complaint, config)
    .then((response) => {
      console.log('Complaint created successfully:', response.data);
      // Handle the successful response here
    })
    .catch((error) => {
      console.log('Error creating complaint:', error);
      // Handle any errors that occurred during the request
    });


  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

    <TouchableOpacity onPress={() => setMenuVisible(true)}>
        
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Avatar.Icon size={40} icon="account-circle" />}
        >
          <Menu.Item
            icon="logout"
            onPress={handleLogout}
            title="Logout"
          />
        </Menu>
      </TouchableOpacity>
        
      <Text style={styles.welcomeText}>Welcome, {userData.name}</Text>

      
      {selectedImage ? (
        <Image
          source={{ uri: selectedImage }}
          style={{
            width: 200,
            height: 200,
            marginBottom: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      ) : (
        <Text style={{textAlign:'center'}}>No image selected</Text>
      )}
      <Button icon="camera" mode="outlined" onPress={handleSelectImage} style={{ marginBottom: 20 }}>
      Choose an image
      </Button>
      <TextInput
        label="Write a problem"
        value={problem}
        onChangeText={setProblem}
        style={styles.input}
        multiline
        mode="outlined"
        numberOfLines={10}
      />

      <TextInput
        label="Landmark"
        value={landmark}
        onChangeText={setLandmark}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
        keyboardType="phone-pad"
        mode="outlined"

      />

      <TextInput
        label="District"
        value={district}
        onChangeText={setDistrict}
        style={styles.input}
        mode="outlined"
      />
      


      <Button mode="contained" onPress={handleCreateComplaint} style={styles.button} >
        Submit
      </Button>

    

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },  
  input: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
  },
  media: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});

export default CreateComplaint;

