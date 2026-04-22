export function parseEstimatedDurationToMinutes(
  estimatedDuration: string | null | undefined,
) {
  if (!estimatedDuration) {
    return 0;
  }

  const value = estimatedDuration.toLowerCase();
  const hoursMatch = value.match(/(\d+)\s*h(?:r|rs|our|ours)?/i);
  const minutesMatch = value.match(/(\d+)\s*m(?:in|ins|inute|inutes)?/i);

  const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
  const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
}

export function formatMinutesToDurationLabel(totalMinutes: number | null | undefined) {
  if (totalMinutes == null || totalMinutes <= 0) {
    return null;
  }

  const safeMinutes = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
  }

  return `${hours} ${hours === 1 ? 'hr' : 'hrs'} ${minutes} min`;
}

export function normalizeEstimatedDurationLabel(
  estimatedDuration: string | null | undefined,
) {
  if (!estimatedDuration) {
    return null;
  }

  const minutes = parseEstimatedDurationToMinutes(estimatedDuration);
  if (minutes > 0) {
    return formatMinutesToDurationLabel(minutes);
  }

  const trimmed = estimatedDuration.trim();
  return trimmed.length > 0 ? trimmed : null;
}
