import { StyleSheet, Image, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 






export default function EventsScreen() {
  const router = useRouter();

  const switchPage = () => {
    router.push('/');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
  


      <TouchableOpacity // button class with more functionality 
                style={styles.button} 
                activeOpacity={0.3}
                accessibilityLabel="Signin Button"
                onPress={switchPage}
            >
                <Text style={styles.buttonText}>New Englands April205</Text>
      </TouchableOpacity>

      <TouchableOpacity // button class with more functionality 
                style={styles.button}
                activeOpacity={0.3}
                accessibilityLabel="Signin Button"
                onPress={switchPage}
            >
                <Text style={styles.buttonText}>States Jan2025</Text>
      </TouchableOpacity>

      <TouchableOpacity // button class with more functionality 
                style={styles.button}
                activeOpacity={0.3}
                accessibilityLabel="Signin Button"
                onPress={switchPage}
            >
                <Text style={styles.buttonText}>Qualifier #2 Jan2025</Text>
      </TouchableOpacity>

      <TouchableOpacity // button class with more functionality 
                style={styles.button}
                activeOpacity={0.3}
                accessibilityLabel="Signin Button"
                onPress={switchPage}
            >
                <Text style={styles.buttonText}>Qualifier #1 Jan2025</Text>
      </TouchableOpacity>

      <TouchableOpacity // button class with more functionality 
                style={styles.button}
                activeOpacity={0.3}
                accessibilityLabel="Signin Button"
                onPress={switchPage}
            >
                <Text style={styles.buttonText}>Scrimmage Dec2024</Text>
      </TouchableOpacity>

    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
      paddingTop: 100,
      flexDirection: 'column',
      alignItems: 'center' 
  },  
  image: {
      width: '54%',
      height: '25%',
      justifyContent: 'center'
  },
  text: {
      color: 'black',
      fontSize: 36, 
      fontWeight: 'bold',
      textAlign: 'center'
  },

  buttonText: {
      color: 'black',
      fontSize: 20, 
      fontWeight: 'semibold',
      textAlign: 'center'
  },
  
  button: {
      backgroundColor: '#f0d41a',
      paddingVertical: 25,
      paddingHorizontal: 50,
      width: 380,
      height: 100,
      borderRadius: 10,
      margin: 4
  },
  

})
