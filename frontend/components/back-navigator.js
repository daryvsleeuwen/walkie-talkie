import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {SvgXml} from 'react-native-svg';
import backIcon from '../assets/icons/arrow-back.svg';

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
            }}>
                <SvgXml xml={backIcon} width="100%" height="100%"></SvgXml>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        width: 36,
        height: 36,
        marginRight: 10,
        marginBottom: 5
    }
})