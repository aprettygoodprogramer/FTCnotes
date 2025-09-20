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
import BlurTabBarBackground from "@/components/ui/TabBarBackground.ios";

export default function TeamsScreen() {
  const { id } = useLocalSearchParams(); // unique id depending on what event you clicked on

  const colorScheme = useColorScheme(); // accesses users current system color scheme
  console.log(id);
  const lightTheme = {
    // may change light mode colors later
    background: "#F3F3F3",
    textColor: "#000000",
  };

  const darkTheme = {
    background: "#111827",
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
      totalScores: number;
      rank: number;
    }[]
  >([]);

  const [event, setEvent] = useState<{
    id: number;
    date: string;
    location: string;
    name: string;
  } | null>(null);

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

        return Promise.all(
          data.map((team: { team_id: number }) =>
            fetch(`https://inp.pythonanywhere.com/api/info/${team.team_id}`)
              .then((res) => {
                if (!res.ok) {
                  throw new Error(`Failed to fetch scores ${res.status}`);
                }
                return res.json();
              })
              .then((scoreData) => {
                // if scores havent been entered yet, array containing
                // all scores is set to all zeros.
                const s = scoreData[0] || {
                  auto_score: 0,
                  teleop_score: 0,
                  endgame_score: 0,
                };
                const totalScores =
                  Number(s.auto_score) +
                  Number(s.teleop_score) +
                  Number(s.endgame_score);

                return {
                  ...team,
                  totalScores,
                };
              })
          )
        );
      })
      .then((teamsWithScores) => {
        // teamsWithScores is an array of all teams that contain totalScores values
        const sortedTeams = teamsWithScores.sort(
          // sort syntax in js, look up if you forget
          (team1, team2) => team2.totalScores - team1.totalScores
        );

        const rankedTeams = sortedTeams.map((team, index) => ({
          ...team,
          rank: index + 1,
        }));

        setTeams(rankedTeams);
      })
      .catch((err) => console.error("Error fetching teams/scores:", err));
  };

  const getTeamScores = async () => {
    try {
      const updatedTeams = await Promise.all(
        teams.map(async (team) => {
          const res = await fetch(
            `https://inp.pythonanywhere.com/api/info/${team.team_id}`
          );
          if (!res.ok)
            throw new Error(`Failed to fetch team scores: ${res.status}`);
          const data = await res.json();
          const totalScores =
            data.auto_score + data.teleop_score + data.endgame_score;
          return { ...team, totalScores };
        })
      );
      setTeams(updatedTeams);
    } catch (error) {
      console.error("Error fetching team scores:", error);
    }
  };

  // gets event to display in topbar
  const getEvent = () => {
    fetch(`https://inp.pythonanywhere.com/api/events/${id}`) // or your GET endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setEvent(data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  useEffect(() => {
    getEvent();

    const fetchTeamsAndScores = async () => {
      await fetchTeams();
      getTeamScores(); // runs only after fetchTeams() finishes
    };
    fetchTeamsAndScores();
  }, []);

  useEffect(() => {
    if (event) {
      console.log("Event updated:", event);
    }
  }, [event]);

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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity activeOpacity={0.3} onPress={eventsPage}>
            <Image style={styles.backIcon} source={backIcon} />
          </TouchableOpacity>
          <Text
            style={[
              styles.text,
              { paddingTop: 20 },
              { color: theme.textColor },
            ]}
          >
            Teams
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.3} onPress={eventSetupFunc}>
          <Image style={styles.plusIcon} source={plusIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>{event?.name}</Text>
        <Text
          style={[
            styles.headerSubText,
            { color: colorScheme === "dark" ? "#ffffff" : "#474747" },
          ]}
        >
          {event?.date} • {event?.location}
        </Text>

        <View style={styles.line}></View>
        {teams.map((team, index) => (
          <View key={index} style={{ position: "relative" }}>
            <View style={styles.actionRow}>
              <View style={styles.rankWrapper}>
                <Text style={{ color: "white" }}>#{team?.rank}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDeleteTeam(team.team_id)}
                style={styles.deleteButtonWrapper}
              >
                <Image
                  source={require("../../../assets/images/TrashIconWhite.png")}
                  style={styles.deleteButton}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                { borderWidth: colorScheme === "light" ? 1 : 0 },
              ]}
              onPress={() => infoPage(team.team_id, team.event_id)} // onPress={teamsPage}
            >
              <Text style={styles.TeamNameText}>{team.name}</Text>
              <Text style={[styles.buttonText, { marginBottom: 10 }]}>
                Team #{team.number}
              </Text>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Image
                  source={require("../../../assets/images/avgIcon3.png")}
                  style={styles.avgButton}
                />
                <Text style={{ fontWeight: "600", fontSize: 15 }}>
                  Avg: {team?.totalScores} pts
                </Text>
              </View>
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
  actionRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    gap: 10,
    top: 20,
    right: 20,
    zIndex: 2,
  },
  line: {
    height: 3,
    width: 360,
    borderRadius: 99,
    backgroundColor: "lightgrey",
    marginTop: 10,
    marginBottom: 10,
  },
  backIcon: {
    width: 60,
    height: 60,
    padding: 8,
    marginLeft: 15,
    marginTop: 11,
  },
  plusIcon: {
    width: 60,
    height: 60,
    padding: 10,
    marginRight: 20,
    marginTop: 11,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  TeamNameText: {
    color: "black",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  headerText: {
    fontWeight: "700",
    marginBottom: 5,
    fontSize: 22,
    color: "#cfa323",
  },
  headerSubText: {
    fontWeight: "500",
    fontSize: 16,
  },
  buttonText: {
    color: "#242424",
    fontSize: 17,
    fontWeight: "500",
  },
  deleteButtonWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(227, 45, 45)",
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
  },
  deleteButton: {
    position: "absolute",
    width: 16.5,
    height: 16.5,
  },
  rankWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 11,
    paddingRight: 11,
    borderRadius: 99,
    backgroundColor: "black",
  },
  avgButton: {
    width: 20,
    height: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: 380,
    borderRadius: 10,
    margin: 8,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "rgb(250,200,0)",
    borderColor: "#dea300",
    borderStyle: "solid",
  },
  teamHeader: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: 380,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 8,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "#e8e6e6",
    borderColor: "#969696",
    borderStyle: "solid",
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
    backgroundColor: "rgb(250,200,0)",
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
