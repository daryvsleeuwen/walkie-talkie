import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';

export default function BackNavigator(props){

    return(
        <View style>
            <Pressable style={styles.backButton} onPress={() =>{
                if(props.navigate){
                    props.navigate('channel-selector');
                }
            }}></Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        width: 30,
        height: 30,
        backgroundColor: '#FF4848',
        marginRight: 10
    }
})