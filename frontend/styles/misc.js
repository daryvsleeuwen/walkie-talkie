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
    alignItems: 'center',
    marginBottom: 55
  },

  pageTitle: {
    fontSize: 28,
    color: '#272727',
    fontFamily: 'Poppins-Medium'
  },

  centerPageTitle:{
    flex: 1,
    textAlign: 'center'
  },

  pageContent: {
    flex: 1,
    marginBottom: 30,
  },

  button: {
    borderRadius: 5,
    padding: 12,  
    width: '100%',
    backgroundColor: '#FF4848',
  },

  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default styles;
