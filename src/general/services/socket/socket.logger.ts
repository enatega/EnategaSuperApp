const SOCKET_LOG_ENABLED =
  __DEV__ || process.env.EXPO_PUBLIC_SOCKET_DEBUG === '1';

const SOCKET_VERBOSE_LOG_ENABLED =
  __DEV__ || process.env.EXPO_PUBLIC_SOCKET_DEBUG === 'verbose';

function formatMessage(message: string, meta?: unknown) {
  return meta === undefined ? [message] : [message, meta];
}

export const socketLogger = {
  debug(message: string, meta?: unknown) {
    if (!SOCKET_VERBOSE_LOG_ENABLED) {
      return;
    }

    console.debug('[socket]', ...formatMessage(message, meta));
  },

  info(message: string, meta?: unknown) {
    if (!SOCKET_LOG_ENABLED) {
      return;
    }

    console.info('[socket]', ...formatMessage(message, meta));
  },

  warn(message: string, meta?: unknown) {
    console.warn('[socket]', ...formatMessage(message, meta));
  },

  error(message: string, meta?: unknown) {
    console.error('[socket]', ...formatMessage(message, meta));
  },
};
