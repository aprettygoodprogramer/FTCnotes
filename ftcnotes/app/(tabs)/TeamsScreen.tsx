import { StyleSheet, Image, Platform, ScrollView, Text, TouchableOpacity, View, TextInput, useColorScheme} from 'react-native';
import {useState} from 'react';
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 





export default function TeamsScreen() {
  const colorScheme = useColorScheme() // accesses users current system color scheme
   

  const lightTheme = {  // may change light mode colors later
      background: '#F3F3F3',
      textColor: '#000000', 
  }
  
  const darkTheme = {
    background: '#232323',
    textColor: '#EFECD7',
  }

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const backIcon = colorScheme === 'dark'
    ? require('../../assets/images/FTCNotesBackIconDark.png')
    : require('../../assets/images/FTCNotesBackIconLight.png');

  const plusIcon = colorScheme === 'dark'
    ? require('../../assets/images/FTCNotesPlusIconDark.png')
    : require('../../assets/images/FTCNotesPlusIconLight.png');



  const router = useRouter();

  const eventsPage = () => {
    router.push('/EventsScreen');
  }

  const infoPage = () => {
    router.push('/InfoScreen')
  }
  

  const [teamNames, setTeamNames] = useState<string[]>([]); // Keeps track of team names
  const [teamNumbers, setTeamNumbers] = useState<string[]>([]); // Keeps track of team numbers
  const [showForm, setShowForm] = useState(false); // toggles form visibility

  const [newTeamName, setNewTeamName] = useState(''); // Team name user is currently creating
  const [addTeam, setAddTeam] = useState(true) // Initial text on screen

  const [newTeamNumber, setNewTeamNumber] = useState(''); // Team number user is creating
  
  const handleAddEvent = () => {
    if (newTeamName.trim().length === 0 || newTeamNumber.trim().length === 0) return;
  
    setTeamNames([...teamNames, newTeamName]); // Adds name to the team names list
    setTeamNumbers([...teamNumbers, newTeamNumber])
    setNewTeamName(''); // Clear the name input
    setNewTeamNumber(''); // Clears the number input

    setShowForm(false);  // Hide the form
  };

  const eventSetupFunc = () => {
    setShowForm(true); // shows form to add event
    setAddTeam(false); // hides initial event text
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background}}>
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.3} onPress={eventsPage}>
        <Image style={styles.backIcon} source={backIcon}/>
        </TouchableOpacity>
        <Text style={[styles.text, {paddingTop: 20}, {color: theme.textColor}]}>Teams</Text>
        <TouchableOpacity activeOpacity={0.3} onPress={eventSetupFunc}>
          <Image style={styles.plusIcon} source={plusIcon}/>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {teamNames.map((teamName, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.button}
            onPress={infoPage}
          >
            <Text style={styles.buttonText}>{teamName} </Text>
            <Text style={styles.buttonText}>{teamNumbers[index]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {addTeam && (
        <View style={styles.centeredTextContainer}>
          <Text style={[styles.text, {color: theme.textColor}]}>Add Teams Here!</Text>
        </View>
      )}

      {showForm && ( // Only displays this when plus button is pressed, setting state to true
        <View style={[styles.formContainer, {backgroundColor: theme.background}]}>
          <TextInput 
            placeholder="Enter team name"
            placeholderTextColor={theme.textColor}
            style={[styles.input, {color: theme.textColor}]}
            value={newTeamName}
            onChangeText={setNewTeamName} // stores text data in the newEventName state 
          />
          <TextInput
            placeholder="Enter team number"
            placeholderTextColor={theme.textColor}
            style={[styles.input, {color: theme.textColor}]}
            value={newTeamNumber}
            onChangeText={setNewTeamNumber}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
            <Text style={styles.buttonText}>Add Team</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: 60,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    height: '15%'

  }, 
  container: {
      paddingTop: 1,
      flexDirection: 'column',
      alignItems: 'center' 
  },  
  backIcon: {
    width: 80,
    height: 80,
    padding: 8,
    marginLeft: 15
  },
  plusIcon: {
    width: 80,
    height: 80,
    padding: 10,
    marginRight: 10
  },
  text: {
      fontSize: 36, 
      fontWeight: 'bold',
      textAlign: 'center'
  },

  buttonText: {
      color: 'black',
      fontSize: 20, 
      fontWeight: '600',
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
  formContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#f0d41a',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  centeredTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }

})
