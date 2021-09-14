import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 60,
    paddingLeft: 30,
    paddingRight: 30,
  },
  
  pageTitleBox: {
    flexDirection: 'row',
    marginBottom: 55
  },

  pageTitle: {
    fontSize: 26,
    color: '#272727',
    fontWeight: 'bold'
  },

  button: {
    borderRadius: 5,
    padding: 14,
    textAlign: 'center',
    flex: 1,
    color: '#ffffff',
    backgroundColor: '#FF4848'
  }
});

export default styles;
