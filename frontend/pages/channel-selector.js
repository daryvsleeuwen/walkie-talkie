import React from 'react';
import Picker from 'rmc-picker';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import styles from '../styles/misc';

export default function ChannelSelector(props) {
  const {navigate} = props.navigation;
  const {socket} = props.route.params;
  let [frequencys, setFrequencys] = React.useState([]);
  const [selectedFrequency, setSelectedFrequency] = React.useState(0);

  socket.on('get_frequencys', frequencys => {
    setFrequencys(frequencys);
  });

  const updateSelectedFrequency = (selected) => {
    setSelectedFrequency(selected);
  };

  return (
    <View style={styles.container}>
      {/* General page title box */}
      <View style={styles.pageTitleBox}>
        <Text style={[styles.pageTitle, styles.centerPageTitle]}>Select Frequency</Text>
      </View>

      {/* General middle part of page */}
      <View style={[styles.pageContent, {justifyContent: 'center', paddingBottom: 55}]}>
        <View style={pageStyles.frequencyPickerBox}>
          <Picker style={pageStyles.frequencyPicker} selectedValue={selectedFrequency} onValueChange={updateSelectedFrequency}>
            {
              frequencys.map((frequency, index) =>{
                return <Picker.Item key={index} value={index}>{frequency}</Picker.Item>
              })
            }
          </Picker>
          <Text style={pageStyles.frequencyText}>Mhz</Text>
        </View>
      </View>

      {/* Page call to action button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={() => {
          navigate('channel-room', {roomid: selectedFrequency,frequency: frequencys[selectedFrequency]});
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
    marginLeft: 45
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
