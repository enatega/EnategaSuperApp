import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  offerIcon: {
    marginRight: 4,
  },
  offerText: {
    fontSize: 12,
  },
  content: {
    padding: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flex: 1,
  },
  name: {
    flex: 1,
  },
  location: {
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  rating: {
    marginLeft: 4,
  },
  reviewCount: {
    marginRight: 6,
  },
  dot: {
    fontSize: 24,
    marginHorizontal: 6,
  },
  line: {
    height: 1,
    marginVertical: 12,
  },
  heartButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
    width: 32,
    zIndex: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dollarSign: {
    fontSize: 16,
    marginLeft: 2,
    marginRight: 2,
  },
  infoText: {
    marginLeft: 4,
  },
})