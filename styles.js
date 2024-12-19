import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(38, 42, 85)', // Dark blue background
    padding: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F3F4FF', // Light color for title
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#E2E4F3', // Slightly different light color for subtitle
    textAlign: 'center',
    marginBottom: 20,
    // fontStyle: 'italic',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#4A3780',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: 300,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: '5%',
  },
  gameInfo: {
    padding: 20,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A3780', // Deep purple
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingLabel: {
    fontSize: 18,
    color: '#6B7280', // Slate gray
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  ratingMax: {
    color: '#95A5A6',
    fontWeight: 'normal',
  },
  yearText: {
    fontSize: 16,
    color: '#6B7280', // Slate gray
    marginBottom: 15,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    color: '#4B5563', // Darker slate
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    marginVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#4A3780',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    marginVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#4A3780',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  errorText: {
    color: '#DC2626', // Error red
    textAlign: 'center',
    marginTop: 10,
  },
  searchingText: {
    color: '#6B7280', // Slate gray
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4A3780',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  creditText: {
    color: '#E2E4F3',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  loadingText: {
    marginTop: 10,
    color: '#6B7280', // Slate gray
    fontSize: 16,
  },
});
