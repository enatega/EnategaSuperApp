import { CachedAddress } from './types';

export const cachedAddresses: CachedAddress[] = [
  {
    placeId: 'place-1',
    description: '596 Powlowski Port, 769 Lincoln Road',
    structuredFormatting: {
      mainText: '596 Powlowski Port',
      secondaryText: '769 Lincoln Road',
    },
    types: ['street_address'],
  },
  {
    placeId: 'place-2',
    description: '3938 Soledad Shore, 21318 Baron Center',
    structuredFormatting: {
      mainText: '3938 Soledad Shore',
      secondaryText: '21318 Baron Center',
    },
    types: ['street_address'],
  },
  {
    placeId: 'place-3',
    description: '3938 Troy Hills, 693 Walter Ferry',
    structuredFormatting: {
      mainText: '3938 Troy Hills',
      secondaryText: '693 Walter Ferry',
    },
    types: ['street_address'],
  },
];
