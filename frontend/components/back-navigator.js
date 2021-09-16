import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';

export default function BackNavigator(props){

    return(
        <View>
            <Pressable style={styles.backButton} onPress={() =>{
                if(props.navigate){
                    if(typeof props.onBack === 'function'){
                        props.onBack();
                    }

                    props.navigate('channel-selector');
                }
            }}></Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        width: 36,
        height: 36,
        backgroundColor: '#FF4848',
        marginRight: 10
    }
})