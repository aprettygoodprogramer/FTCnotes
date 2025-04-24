import { StyleSheet, Image, Platform, ScrollView, Text, TouchableOpacity, View, TextInput, useColorScheme} from 'react-native';
import {useState} from 'react';
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
import { ThemedView } from '@/components/ThemedView';




export default function InfoScreen() {
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

  const teamsPage = () => {
    router.push('/TeamsScreen');
  }
  


  const [autoScore, setAutoScore] = useState<string[]>([]); // Keeps track of auto score
  const [teleopScore, setTeleopScore] = useState<string[]>([]); // Keeps track of teleop score
  const [endgameScore, setEndgameScore] = useState<string[]>([]); // Keeps track of endgame score
  const [notes, setNotes] = useState<string[]>([]); // Keeps track of notes 

  const [showForm, setShowForm] = useState(false); // toggles form visibility

  const [newAutoScore, setNewAutoScore] = useState(''); // auto socre user is currently creating
  const [newTeleopScore, setNewTeleopScore] = useState(''); // teleop score user is creating
  const [newEndgameScore, setNewEndgameScore] = useState(''); // endgame score user is creating
  const [newNotes, setNewNotes] = useState(''); // notes user is currently creating
  
  const [addInfo, setAddInfo] = useState(true) // Initial text on screen


  const handleAddEvent = () => {
    if (newAutoScore.trim().length === 0 || newTeleopScore.trim().length === 0 || newEndgameScore.trim().length === 0) return;
  
    setAutoScore([...autoScore, newAutoScore]); // Stores new auto score
    setTeleopScore([...teleopScore, newTeleopScore]); // Stores new teleop score
    setEndgameScore([...endgameScore, newEndgameScore]); // Stores new endgame score
    setNotes([...notes, newNotes]); // stores new notes

    // Clears all textInputs
    setNewAutoScore(''); 
    setNewTeleopScore(''); 
    setNewEndgameScore(''); 
    setNewNotes('');

    setShowForm(false);  // Hides the form
  };

  const eventSetupFunc = () => {
    setShowForm(true); // shows form to add event
    setAddInfo(false); // hides initial event text
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background}}>
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.3} onPress={teamsPage}>
        <Image style={styles.backIcon} source={backIcon}/>
        </TouchableOpacity>
        <Text style={[styles.text, {paddingTop: 20}, {color: theme.textColor}]}>Team Info</Text>
        <TouchableOpacity activeOpacity={0.3} onPress={eventSetupFunc}>
          <Image style={styles.plusIcon} source={plusIcon}/>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {autoScore.map((score, index) => (
        <View style={{flex: 1, backgroundColor: theme.background}} key={index}>
            <Text style={[styles.buttonText, {color: theme.textColor}]}>Auto Score: {score} </Text>
            <Text style={[styles.buttonText, {color: theme.textColor}]}>Teleop Score: {teleopScore[index]}</Text>
            <Text style={[styles.buttonText, {color: theme.textColor}]}>Endgame Score: {endgameScore[index]}</Text>
            <Text style={[styles.buttonText, {color: theme.textColor}]}>Notes: {notes[index]}</Text>
        </View>
        ))}
      </ScrollView>
      {addInfo && (
        <View style={styles.centeredTextContainer}>
          <Text style={[styles.text, {color: theme.textColor}]}>Add Info Here!</Text>
        </View>
      )}

      {showForm && ( // Only displays this when plus button is pressed, setting state to true
        <View style={[styles.formContainer, {backgroundColor: theme.background}]}>
          <TextInput 
            placeholder="Enter auto score"
            placeholderTextColor={theme.textColor}
            style={[styles.input, {color: theme.textColor}]}
            value={newAutoScore}
            onChangeText={setNewAutoScore} // stores text data in the newAutoScore state 
          />
          <TextInput
            placeholder="Enter teleop score"
            placeholderTextColor={theme.textColor}
            style={[styles.input, {color: theme.textColor}]}
            value={newTeleopScore}
            onChangeText={setNewTeleopScore}
          />
          <TextInput
            placeholder="Enter endgame score"
            placeholderTextColor={theme.textColor}
            style={[styles.input, {color: theme.textColor}]}
            value={newEndgameScore}
            onChangeText={setNewEndgameScore}
          />
          <TextInput
            placeholder="Enter notes"
            placeholderTextColor={theme.textColor}
            style={[styles.input, {color: theme.textColor}]}
            value={newNotes}
            onChangeText={setNewNotes}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
            <Text style={[styles.buttonText]}>Add Info</Text>
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
