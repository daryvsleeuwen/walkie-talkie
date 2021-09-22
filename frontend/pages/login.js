import { React, useState, useEffect }  from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import styles from '../styles/misc';


export default function Login(){
    const [username, onUsernameChange] = React.useState(null);
    const [password, onPasswordChange] = React.useState(null);
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
      }, []);


    function loginAttempt(){
        console.log('attempting login...')
        auth().signInWithEmailAndPassword(username, password).then(() => {
            console.log('logged in!')
        })
    }



    return (
        <View style={styles.container}>
            {/* General page title box */}
            <View style={styles.pageTitleBox}>
                <Text style={[styles.pageTitle, styles.centerPageTitle]}>Please Login</Text>
            </View>

            {/* General middle part of page */}
            <View style={styles.pageContent}>
                <TextInput
                    style={styles.input}
                    onChangeText={onUsernameChange}
                    value={username}
                    placeholder="Username"
                />

                <TextInput
                    style={styles.input}
                    onChangeText={onPasswordChange}
                    value={password}
                    placeholder="Password"
                />
            </View>

            {/* Page call to action button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={() => {
                        loginAttempt
                    }}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
    );
}

const pageStyles = StyleSheet.create({

});
