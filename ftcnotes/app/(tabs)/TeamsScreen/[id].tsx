import {
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  useColorScheme,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TeamsScreen() {
  const fetchTeams = () => {
    fetch(`https://inp.pythonanywhere.com/api/teams/${id}`) // or your GET endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setTeams(data); // assumes `data` is an array of team objects
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const colorScheme = useColorScheme(); // accesses users current system color scheme
  const { id } = useLocalSearchParams(); // unique id depending on what event you clicked on
  console.log(id);
  const lightTheme = {
    // may change light mode colors later
    background: "#F3F3F3",
    textColor: "#000000",
  };

  const darkTheme = {
    background: "#232323",
    textColor: "#EFECD7",
  };

  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  const backIcon =
    colorScheme === "dark"
      ? require("../../../assets/images/FTCNotesBackIconDark.png")
      : require("../../../assets/images/FTCNotesBackIconLight.png");

  const plusIcon =
    colorScheme === "dark"
      ? require("../../../assets/images/FTCNotesPlusIconDark.png")
      : require("../../../assets/images/FTCNotesPlusIconLight.png");

  const router = useRouter();

  const eventsPage = () => {
    router.push("/EventsScreen");
  };

  const infoPage = (id: Number, event_id: Number) => {
    console.log(id);
    router.push(`/InfoScreen/${id}/${event_id}`);
  };

  const [teams, setTeams] = useState<
    {
      team_id: number;
      event_id: number;
      date_created: string;
      name: string;
      number: number;
    }[]
  >([]);

  // Hides or shows starting text
  useEffect(() => {
    if (teams.length > 0) {
      setAddTeamText(false);
    } else {
      setAddTeamText(true);
    }
  }, [teams]); // Triggers whenever teams list is updated

  const [showForm, setShowForm] = useState(false); // toggles form visibility
  const [addTeamText, setAddTeamText] = useState(true); // Initial text on screen

  const [newTeamName, setNewTeamName] = useState(""); // Team name user is currently creating
  const [newTeamNumber, setNewTeamNumber] = useState(""); // Team number user is creating

  const handleAddTeam = () => {
    if (newTeamName.trim().length === 0 || newTeamNumber.trim().length === 0)
      return;

    setShowForm(false); // Hide the form

    // Creates new team
    fetch(`https://inp.pythonanywhere.com/api/create-team`, {
      method: "POST",
      body: JSON.stringify({
        event_id: id,
        date_created: "2025-06-04", // TODO: Either make this not useless or remove it
        name: newTeamName,
        number: newTeamNumber,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => {
        console.log("Response Status:", response.status); // logs HTTP response code
        return response.text();
      })
      .then((text) => {
        // 'text' is the return response from previous .then statement
        if (text.startsWith("{")) {
          console.log("Event created successfully:", text);
          fetchTeams();
        } else {
          console.error("Unexpected response:", text);
        }
      })
      .catch((error) => {
        console.error("Error posting event:", error);
      });

    setNewTeamName(""); // Clear the name input
    setNewTeamNumber(""); // Clears the number input
  };

  const handleDeleteTeam = (eventId: number) => {
    fetch(`https://inp.pythonanywhere.com/api/delete-team/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        console.log("Event deleted:", data);
        fetchTeams(); // refresh list
      })
      .catch((err) => console.error("Error deleting event:", err));
  };

  const eventSetupFunc = () => {
    setShowForm(true); // shows form to add event
    setAddTeamText(false); // hides initial event text
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.3} onPress={eventsPage}>
          <Image style={styles.backIcon} source={backIcon} />
        </TouchableOpacity>
        <Text
          style={[styles.text, { paddingTop: 20 }, { color: theme.textColor }]}
        >
          Teams
        </Text>
        <TouchableOpacity activeOpacity={0.3} onPress={eventSetupFunc}>
          <Image style={styles.plusIcon} source={plusIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {teams.map((team, index) => (
          <View key={index} style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => handleDeleteTeam(team.team_id)}
              style={styles.deleteButtonWrapper}
            >
              <Image
                source={require("../../../assets/images/FTCNotesTrashIcon.png")}
                style={styles.deleteButton}
              />
            </TouchableOpacity>

            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => infoPage(team.team_id, team.event_id)} // onPress={teamsPage}
            >
              <Text style={styles.buttonText}>{team.name}</Text>
              <Text style={styles.buttonText}>{team.number}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {addTeamText && (
        <View style={styles.centeredTextContainer}>
          <Text style={[styles.text, { color: theme.textColor }]}>
            Add Teams Here!
          </Text>
        </View>
      )}

      {showForm && ( // Only displays this when plus button is pressed, setting state to true
        <View
          style={[styles.formContainer, { backgroundColor: theme.background }]}
        >
          <TextInput
            placeholder="Enter team name"
            placeholderTextColor={theme.textColor}
            style={[styles.input, { color: theme.textColor }]}
            value={newTeamName}
            onChangeText={setNewTeamName} // stores text data in the newEventName state
          />
          <TextInput
            placeholder="Enter team number"
            placeholderTextColor={theme.textColor}
            style={[styles.input, { color: theme.textColor }]}
            value={newTeamNumber}
            onChangeText={setNewTeamNumber}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddTeam}>
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
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    height: "15%",
  },
  container: {
    paddingTop: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  backIcon: {
    width: 80,
    height: 80,
    padding: 8,
    marginLeft: 15,
  },
  plusIcon: {
    width: 80,
    height: 80,
    padding: 10,
    marginRight: 10,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },

  buttonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  deleteButtonWrapper: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 2,
  },
  deleteButton: {
    transform: [{ translateX: 15 }, { translateY: 15 }],
    position: "absolute",
  },
  button: {
    backgroundColor: "#f0d41a",
    paddingVertical: 25,
    paddingHorizontal: 50,
    width: 380,
    height: 100,
    borderRadius: 10,
    margin: 4,
  },
  formContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButton: {
    backgroundColor: "#f0d41a",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  centeredTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
