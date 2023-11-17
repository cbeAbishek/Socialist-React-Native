import React, { useState ,useEffect} from 'react';
import { View, StyleSheet, ScrollView, Text ,TouchableOpacity,Image} from 'react-native';
import { Card, Avatar, Paragraph, Button,Menu } from 'react-native-paper';
import axios from  'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const ComplaintList = () => {
  // Like count object with individual counts for each card
  const [likeCounts, setLikeCounts] = useState({});
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation(); // get the navigation object

  const handleLike = (id) => {
    // Update the like count for the specified complaint id
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) + 1,
    }));
  };

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    // Fetch all complaints from the API
    axios.get('http://192.168.159.216:8080/problems')
      .then((response) => {
        // Update the complaints state with the response data
        setComplaints(response.data);
      })
      .catch((error) => {
        console.log('Error retrieving complaints:', error);
      });
  }, []);


 
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
  return (
    <View style={styles.container}>

      
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
      <Text style={styles.title}>Complaints</Text>

      <ScrollView contentContainerStyle={styles.scrollView}>
        {complaints.map((complaint) => (
          <Card key={complaint.id} style={styles.card}>
            <Card.Title
              title={complaint.user.name}
              subtitle={`Submitted by: ${complaint.date}`}
              left={() => <Avatar.Image size={40} source={{ uri: complaint.user.avatar }} />}
            />
            {/* Replace `complaint.image` with appropriate field from the JSON */}
            {complaint.image && <Card.Cover source={{ uri: complaint.image }} />}
            <Card.Content>
              {/* Replace `complaint.problem_statement` with appropriate field from the JSON */}
              <Paragraph>{complaint.problem_statement}</Paragraph>
              {/* Replace `complaint.district` with appropriate field from the JSON */}
              <Paragraph>District: {complaint.district}</Paragraph>
              {/* Replace `complaint.landmark` with appropriate field from the JSON */}
              <Paragraph>Landmark: {complaint.landmark}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button icon="thumb-up-outline" onPress={() => handleLike(complaint.id)}>
                {likeCounts[complaint.id] || 0} Likes
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  scrollView: {
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default ComplaintList;
