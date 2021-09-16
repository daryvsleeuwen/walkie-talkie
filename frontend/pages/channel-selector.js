import React from 'react';
import Picker from 'rmc-picker';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import styles from '../styles/misc';

export default function ChannelSelector(props) {
  const {navigate} = props.navigation;
  const [selectedFrequency, setSelectedFrequency] = React.useState(0);
  const frequencys = [61.5, 74.2, 88.6, 107.3, 121.8, 137.2, 159.7];
  const frequecySelectors = [];

  frequencys.forEach((frequecy, index) => {
    frequecySelectors.push(
      <Picker.Item key={index} value={index}>
        {frequecy}
      </Picker.Item>
    );
  });

  const updateFrequency = (selected) => {
    setSelectedFrequency(selected);
  };

  return (
    <View style={styles.container}>
      {/* General page title box */}
      <View style={styles.pageTitleBox}>
        <Text style={styles.pageTitle}>Select Frequency</Text>
      </View>

      {/* General middle part of page */}
      <View style={styles.pageContent}>
        <View style={pageStyles.frequencyPickerBox}>
          <Picker style={pageStyles.frequencyPicker} selectedValue={selectedFrequency} onValueChange={updateFrequency}>
            {frequecySelectors}
          </Picker>
          <Text style={pageStyles.frequencyText}>Mhz</Text>
        </View>
      </View>

      {/* Page call to action button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={() => {
          navigate('channel-room', {frequency: frequencys[selectedFrequency]});
        }}>
        <Text style={styles.buttonText}>Join Channel</Text>
      </TouchableOpacity>
    </View>
  );
}

const pageStyles = StyleSheet.create({
  frequencyPickerBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  frequencyPicker: {
    width: '30%',
    marginRight: 10,
  },

  frequencyText: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
  },
});
