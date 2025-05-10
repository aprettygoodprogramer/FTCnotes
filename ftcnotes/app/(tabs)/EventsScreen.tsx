  import { StyleSheet, Image, Platform, ScrollView, Text, TouchableOpacity, View, TextInput, useColorScheme} from 'react-native';
  import {useState, useEffect, useCallback} from 'react';
  import { useFocusEffect } from '@react-navigation/native';

  import { useRouter } from 'expo-router'; 
  import { Ionicons } from '@expo/vector-icons'; 


  


  export default function EventsScreen() {

    const [addEventsText, setAddEventsText] = useState(true) // Initial text prompt on screen

    // Grabs all Current events in the Database and saves them to the events state. 
    const fetchEvents = () => {
      fetch("https://ftcnotesbackend-production.up.railway.app/events") // or your GET endpoint
          .then(res => {
              if (!res.ok) {
                  throw new Error(`Failed to fetch events: ${res.status}`);
              }
              return res.json();
          })
          .then(data => {
              setEvents(data); // assumes `data` is an array of event objects
          })
          .catch(err => console.error("Error fetching events:", err));
        
        
      };
      
      // Calls fetchEvents function upon page load and every time add event button is pressed
      useEffect(() => {
        fetchEvents(); 
      }, []);

      
    
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
    

    const [showForm, setShowForm] = useState(false); // toggles form visibility
    // List of event objects grabbed from db that will be rendered on screen
    const [events, setEvents] = useState<{event_id: number; name: string; date: string; location: string }[]>([]);

    // Hides or shows starting text
    useEffect(() => {
      if (events.length > 0) {
        setAddEventsText(false);
      } else {
        setAddEventsText(true); 
      }
    }, [events]); // Triggers whenever events list is updated

    // Event data user is currently generating
    const [newEventName, setNewEventName] = useState(''); 
    const [newEventDate, setNewEventDate] = useState('');  
    const [newEventLocation, setNewEventLocation] = useState(''); 


    const handleAddEvent = () => {
      if (newEventName.trim().length === 0) return;

      
      setShowForm(false);  // Hide the form

      fetch("https://ftcnotesbackend-production.up.railway.app/create-event", {
        method: "POST",
        body: JSON.stringify({
        name: newEventName,
        date: newEventDate,
        location: newEventLocation
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => {
        console.log("Response Status:", response.status); // logs HTTP response code
        return response.text();   
      })
      .then(text => { // 'text' is the return response from previous .then statement
        if (text.startsWith("Event created")) {
          console.log("Event created successfully:", text);
          fetchEvents();  
        } else {
          console.error("Unexpected response:", text);
        }
      })
      .catch(error => {
        console.error("Error posting event:", error);
      });

      // Clear the input
      setNewEventName(''); 
      setNewEventDate('');
      setNewEventLocation(''); 
    };

    const handleDeleteEvent = (eventId: number) => {
      fetch(`https://ftcnotesbackend-production.up.railway.app/delete-event/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(data => {
        console.log("Event deleted:", data);
        fetchEvents(); // refresh list
      })
      .catch(err => console.error("Error deleting event:", err));
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
          {events.map((event, index) => (
          <View key={index} style={styles.button}>
            <TouchableOpacity onPress={() => handleDeleteEvent(event.event_id)} style={styles.deleteButtonWrapper}>
                <Image source={require('../../assets/images/FTCNotesTrashIcon.png')}  
                        style={styles.deleteButton}
                 />
              </TouchableOpacity>

            <TouchableOpacity 
              key={index}
              style={styles.button}
              onPress={teamsPage} // onPress={teamsPage}
            >
              <Text style={styles.buttonText}>{event.name}</Text>
              <Text style={styles.buttonText}>{event.date}</Text>
              <Text style={styles.buttonText}>{event.location}</Text>
            </TouchableOpacity>
          </View>
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
            <TextInput 
              placeholder="Enter date"
              placeholderTextColor={theme.textColor}
              style={[styles.input, {color: theme.textColor}]}
              value={newEventDate}
              onChangeText={setNewEventDate} // stores text data in the newEventName state 
            />
            <TextInput 
              placeholder="Enter location"
              placeholderTextColor={theme.textColor}
              style={[styles.input, {color: theme.textColor}]}
              value={newEventLocation}
              onChangeText={setNewEventLocation} // stores text data in the newEventName state 
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
    deleteButtonWrapper: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 2
    },
    deleteButton: {
      transform: [{ translateX: 15 }, {translateY: 15}],
      position: 'absolute'
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
        alignItems: 'center',
        justifyContent: 'center',
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
