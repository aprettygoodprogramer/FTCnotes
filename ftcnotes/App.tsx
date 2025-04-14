import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/(tabs)';
import EventsScreen from './app/(tabs)/EventsScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EventsScreen">
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="events" component={EventsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
