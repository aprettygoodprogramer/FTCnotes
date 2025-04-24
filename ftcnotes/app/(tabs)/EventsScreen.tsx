  import { StyleSheet, Image, Platform, ScrollView, Text, TouchableOpacity, View, TextInput, useColorScheme} from 'react-native';
  import {useState} from 'react';
  import { useRouter } from 'expo-router'; 
  import { Ionicons } from '@expo/vector-icons'; 





  export default function EventsScreen() {
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

    const homeIcon = colorScheme === 'dark'
      ? require('../../assets/images/FTCNotesHomeIconDark.png')
      : require('../../assets/images/FTCNotesHomeIconLight.png');

    const plusIcon = colorScheme === 'dark'
      ? require('../../assets/images/FTCNotesPlusIconDark.png')
      : require('../../assets/images/FTCNotesPlusIconLight.png');
 

    const router = useRouter();

    const homePage = () => {
      router.push('/');
    }

    const teamsPage = () => {
      router.push('/TeamsScreen')
    }
    

    const [events, setEvents] = useState<string[]>([]); // Keeps track of event names
    const [showForm, setShowForm] = useState(false); // toggles form visibility
    const [newEventName, setNewEventName] = useState(''); // Event user is currently generating
    const [addEventsText, setAddEventsText] = useState(true) // Initial text prompt on screen

    const handleAddEvent = () => {
      if (newEventName.trim().length === 0) return;
    
      setEvents([...events, newEventName]); // Adds text to the events list
      setNewEventName(''); // Clear the input
      setShowForm(false);  // Hide the form
    };

    const eventSetupFunc = () => {
      setShowForm(true); // shows form to add event
      setAddEventsText(false); // hides initial event text
    }

    return (
      <View style={{ flex: 1, backgroundColor: theme.background}}>
        <View style={styles.topBar}>
          <TouchableOpacity activeOpacity={0.3} onPress={homePage}>
          <Image style={styles.homeIcon} source={homeIcon}/>
          </TouchableOpacity>
          <Text style={[styles.text, {paddingTop: 20}, {color: theme.textColor}]}>Events</Text>
          <TouchableOpacity activeOpacity={0.3} onPress={eventSetupFunc}>
            <Image style={styles.plusIcon} source={plusIcon}/>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {events.map((eventName, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.button}
              onPress={teamsPage}
            >
              <Text style={styles.buttonText}>{eventName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {addEventsText && (
          <View style={styles.centeredTextContainer}>
            <Text style={[styles.text, {color: theme.textColor}]}>Add FTC Events Here!</Text>
          </View>
        )}

        {showForm && ( // Only displays this when plus button is pressed, setting state to true
          <View style={[styles.formContainer, {backgroundColor: theme.background}]}>
            <TextInput 
              placeholder="Enter event name"
              placeholderTextColor={theme.textColor}
              style={[styles.input, {color: theme.textColor}]}
              value={newEventName}
              onChangeText={setNewEventName} // stores text data in the newEventName state 
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
              <Text style={styles.buttonText}>Add Event</Text>
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
    homeIcon: {
      width: 80,
      height: 80,
      padding: 10,
      marginLeft: 15
    },
    plusIcon: {
      width: 80,
      height: 80,
      padding: 10,
      marginRight: 10
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
