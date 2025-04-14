import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import { useRouter } from 'expo-router'; // Import useRouter
import { Ionicons } from '@expo/vector-icons'; 
import * as Font from 'expo-font'


const HomeScreen = () => {
    const router = useRouter();

    const switchPage = () => {
        router.push('/EventsScreen');
    }


    return (
        
        <View style={styles.container}>
        
        <View style={{ marginBottom: 20 }}>
            <Ionicons name="add-circle" size={48} color="red" />
        </View>
            
            <Text style={styles.text}>FTC Notes</Text>
            <Image style={styles.image} source={require('../../assets/images/screaming-eagles.png')} />

            <TouchableOpacity // button class with more functionality 
                style={styles.button}
                activeOpacity={0.3}
                accessibilityLabel="Signin Button"
                onPress={switchPage}
            >
                <Text style={styles.buttonText}>Sign In</Text>
           </TouchableOpacity>
        </View>
    )
}

export default HomeScreen 

const styles = StyleSheet.create({
    container: {
        flex: 1, // Makes <View></View> tag fill screen
        flexDirection: 'column',
        justifyContent: 'center', // centers all content within this
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
        fontSize: 36, 
        fontWeight: 'semibold',
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#f0d41a',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        margin: 20
    },
    

})
