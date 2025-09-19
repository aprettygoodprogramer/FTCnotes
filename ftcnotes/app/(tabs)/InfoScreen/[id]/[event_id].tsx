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
import { ThemedView } from "@/components/ThemedView";

export default function InfoScreen() {
  const fetchInfo = () => {
    fetch(`https://inp.pythonanywhere.com/api/info/${id}`) // or your GET endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch info: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const info = data[0]; // needed to get dict because GET returns a list containing a dict
          setAutoScore(info["auto_score"]);
          setTeleopScore(info["teleop_score"]);
          setEndgameScore(info["endgame_score"]);
          setNotes(info["notes"]);
          setAddInfo(false); // hides initial info text
        }
      })
      .catch((err) => console.error("Error fetching events:", err));

    fetch(`https://inp.pythonanywhere.com/api/teams/${event_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch team: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const team = data[0];
        setTeamName(team["name"]);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const colorScheme = useColorScheme(); // accesses users current system color scheme

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
      ? require("../../../../assets/images/FTCNotesBackIconDark.png")
      : require("../../../../assets/images/FTCNotesBackIconLight.png");

  const plusIcon =
    colorScheme === "dark"
      ? require("../../../../assets/images/FTCNotesPlusIconDark.png")
      : require("../../../../assets/images/FTCNotesPlusIconLight.png");

  const router = useRouter();
  const { id, event_id } = useLocalSearchParams(); // unique id depending on what event you clicked on

  const teamsPage = () => {
    console.log(event_id);
    router.push(`../../TeamsScreen/${event_id}`);
  };
  const [teamName, setTeamName] = useState(""); // stores and displays team name

  const [showForm, setShowForm] = useState(false); // toggles form visibility
  const [addInfo, setAddInfo] = useState(true); // Initial text on screen
  const [eventID, setEventID] = useState(""); // event_id to return to team_screen

  const [autoScore, setAutoScore] = useState(""); // notes user is currently creating
  const [teleopScore, setTeleopScore] = useState(""); // notes user is currently creating
  const [endgameScore, setEndgameScore] = useState(""); // notes user is currently creating
  const [notes, setNotes] = useState(""); // notes user is currently creating

  const handleAddEvent = () => {
    console.log(id);
    if (notes.trim().length === 0) return;
    fetch(`https://inp.pythonanywhere.com/api/create-info`, {
      method: "POST",
      body: JSON.stringify({
        team_id: id,
        auto_score: autoScore,
        teleop_score: teleopScore,
        endgame_score: endgameScore,
        notes: notes,
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
        if (text.startsWith("{") || text.startsWith('"E')) {
          console.log("Event created successfully:", text);
          fetchInfo();
        } else {
          console.error("Unexpected response:", text);
        }
      })
      .catch((error) => {
        console.error("Error posting event:", error);
      });

    // Clears all team info
    setNotes("");
    setAutoScore("");
    setTeleopScore("");
    setEndgameScore("");

    setShowForm(false); // Hides the form
  };

  const eventSetupFunc = () => {
    setShowForm(true); // shows form to add info
    setAddInfo(false); // hides initial info text
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.topBar}>
        <TouchableOpacity activeOpacity={0.3} onPress={teamsPage}>
          <Image style={styles.backIcon} source={backIcon} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.3} onPress={eventSetupFunc}>
          <Image style={styles.plusIcon} source={plusIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {!addInfo && (
          <View style={{ flex: 1, backgroundColor: theme.background }}>
            <Text
              style={[
                styles.text,
                { paddingTop: 20 },
                { color: theme.textColor },
              ]}
            >
              {teamName}:
            </Text>
            <Text
              style={[
                styles.text,
                { paddingTop: 150 },
                { color: theme.textColor },
              ]}
            >
              Auto Score: {autoScore}
            </Text>
            <Text
              style={[
                styles.text,
                { paddingTop: 20 },
                { color: theme.textColor },
              ]}
            >
              Teleop Score: {teleopScore}
            </Text>
            <Text
              style={[
                styles.text,
                { paddingTop: 20 },
                { color: theme.textColor },
              ]}
            >
              Endgame Score: {endgameScore}
            </Text>
            <Text
              style={[
                styles.text,
                { paddingTop: 20 },
                { color: theme.textColor },
              ]}
            >
              Notes: {notes}
            </Text>
          </View>
        )}
      </ScrollView>

      {addInfo && (
        <View style={styles.centeredTextContainer}>
          <Text style={[styles.text, { color: theme.textColor }]}>
            Add Info Here!
          </Text>
        </View>
      )}

      {showForm && ( // Only displays this when plus button is pressed, setting state to true
        <View
          style={[styles.formContainer, { backgroundColor: theme.background }]}
        >
          <TextInput
            placeholder="Enter auto score"
            placeholderTextColor={theme.textColor}
            style={[styles.input, { color: theme.textColor }]}
            value={autoScore}
            onChangeText={setAutoScore}
          />
          <TextInput
            placeholder="Enter teleop score"
            placeholderTextColor={theme.textColor}
            style={[styles.input, { color: theme.textColor }]}
            value={teleopScore}
            onChangeText={setTeleopScore}
          />
          <TextInput
            placeholder="Enter endgame score"
            placeholderTextColor={theme.textColor}
            style={[styles.input, { color: theme.textColor }]}
            value={endgameScore}
            onChangeText={setEndgameScore}
          />
          <TextInput
            placeholder="Enter notes"
            placeholderTextColor={theme.textColor}
            style={[styles.input, { color: theme.textColor }]}
            value={notes}
            onChangeText={setNotes}
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
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    height: "15%",
  },

  container: {
    paddingTop: 1,
    flexDirection: "row",
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

  button: {
    backgroundColor: "#FACC15",
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
