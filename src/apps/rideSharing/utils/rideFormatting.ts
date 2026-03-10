export function formatRideCurrency(value: number | undefined) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'QAR 0.00';
  }

  return `QAR ${value.toFixed(2)}`;
}

export function formatRideEstimate(value: number | undefined) {
  return `~${formatRideCurrency(value)}`;
}
