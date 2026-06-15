type FormatCurrencyOptions = {
  amountPrefix?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  useGrouping?: boolean;
};

function shouldInsertSpaceBetweenLabelAndAmount(currencyLabel: string) {
  return /[A-Za-z0-9]/.test(currencyLabel);
}

export function formatCurrencyLabelAmount(
  amount: number | null | undefined,
  currencyLabel: string,
  options: FormatCurrencyOptions = {},
) {
  const {
    amountPrefix = '',
    maximumFractionDigits = 2,
    minimumFractionDigits = 2,
    useGrouping = false,
  } = options;

  const safeAmount =
    typeof amount === 'number' && Number.isFinite(amount) ? amount : 0;
  const normalizedCurrencyLabel = currencyLabel.trim();
  const formattedAmount = new Intl.NumberFormat(undefined, {
    maximumFractionDigits,
    minimumFractionDigits,
    useGrouping,
  }).format(safeAmount);
  const separator = shouldInsertSpaceBetweenLabelAndAmount(
    normalizedCurrencyLabel,
  )
    ? ' '
    : '';

  return `${amountPrefix}${normalizedCurrencyLabel}${separator}${formattedAmount}`;
}
