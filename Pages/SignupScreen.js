import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';


const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const navigation = useNavigation(); // get the navigation object
  const [secureTextEntry, setSecureTextEntry] = useState(true); // state variable to toggle password visibility

  const handleSignup = async () => {

    const values = {
        name: username,
        email: email,
        password: password,
        phone: phone,
        district: district,
      }

    // handle signup logic here    const url = 'http://10.1.1.59:8080/login';

      try{
        const response = await axios.post('http://192.168.159.216:8080/users', values);
        console.log(response.data);
        navigation.goBack();
      } catch (error) {
        console.error(error);
      }
    
  };

  const handleSignin = () => {
    navigation.navigate('Home');

  };


  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  }

  const districts = [
    'Ariyalur',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Krishnagiri',
    'Madurai',
    'Nagapattinam',
    'Namakkal',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Salem',
    'Sivaganga',
    'Thanjavur',
    'Theni',
    'Thoothukudi',
    'Tiruchirappalli',
    'Tirunelveli',
    'Tirupathur',
    'Tiruppur',
    'Tiruvallur',
    'Tiruvannamalai',
    'Tiruvarur',
    'Vellore',
    'Viluppuram',
    'Virudhunagar'
  ];

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Create Account</Text>

      <TextInput
        mode="outlined"
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 20 }}
      />

      <TextInput
        mode="outlined"
        label="Email"
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
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


      <TextInput
        mode="outlined"
        label="Phone"
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={setPhone}
        style={{ marginBottom: 20 }}
      />

      <Picker
        mode="dropdown"
        selectedValue={district}
        onValueChange={(itemValue) => setDistrict(itemValue)}
        style={{ marginBottom: 20 }}
      >
        <Picker.Item label="Select your district" value="" />
        {districts.map((district) => (
          <Picker.Item key={district} label={district} value={district} />
        ))}
      </Picker>

      <Button mode="contained" onPress={handleSignup}>
        Signup
      </Button>

      
      <TouchableOpacity onPress={handleSignin}>
        <Text style={styles.signupText}>Have an account? Sign in</Text>
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

export default SignupScreen;
