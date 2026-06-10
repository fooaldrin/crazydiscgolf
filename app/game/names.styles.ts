import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333333',
    fontFamily: 'Slackey_400Regular',
    lineHeight: 56, // Add lineHeight to prevent clipping
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    backgroundColor: '#C9FDF2',
    borderWidth: 1,
    borderColor: '#85D1DB',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});
