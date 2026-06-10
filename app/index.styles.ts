import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  introContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 35, // Push logo down 15 pixels from default 20
  },
  introTitle: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 60,
    fontFamily: 'Slackey_400Regular',
    fontSize: 48,
    lineHeight: 56, // Add lineHeight to prevent clipping
  },
  buttonArea: {
    padding: 40,
    gap: 20,
  },
  newGameButton: {
    backgroundColor: '#85D1DB',
  },
  settingsButtonIntro: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: '#333333',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
  },
  bottomButtonContainer: {
    padding: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 60,
    paddingHorizontal: 20,
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    flex: 1,
    color: '#333333',
    fontFamily: 'Slackey_400Regular',
    fontSize: 32,
    lineHeight: 40, // Add lineHeight to prevent clipping
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  settingsButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    letterSpacing: 2,
  },
  selectorContainer: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#C9FDF2',
  },
  label: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#333333',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  pickerButton: {
    backgroundColor: '#4DB8C4',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 28, // Add lineHeight to prevent clipping and fix alignment
  },
  helperText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    color: '#666666',
    opacity: 0.8,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#85D1DB',
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  valueContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    minWidth: 60,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 38, // Add lineHeight to prevent clipping and fix alignment
  },
  disabledValueContainer: {
    opacity: 0.4,
  },
  disabledText: {
    color: '#999999',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#85D1DB',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
    lineHeight: 22, // Add lineHeight for consistency
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22, // Add lineHeight for alignment
  },
  continueButton: {
    backgroundColor: '#B6F2D1',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
});
