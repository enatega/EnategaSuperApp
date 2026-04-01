import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  compactContainer: {
    width: 280,
  },
  fullWidthContainer: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
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
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  offerIcon: {
    marginRight: 4,
  },
  offerText: {
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flex: 1,
  },
  name: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
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
    marginVertical: 4,
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
    gap: 4,
  },
  dollarSign: {
    fontSize: 16,
    marginLeft: 2,
    marginRight: 2,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
})
