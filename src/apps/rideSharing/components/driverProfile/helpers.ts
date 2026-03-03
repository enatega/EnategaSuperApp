// ─── Date / Time Helpers ──────────────────────────────────────────────────────

/** Returns a human-readable "joined" duration, e.g. "4mo" or "1 yr". */
export function formatJoinYear(isoDate: string): string {
    const date = new Date(isoDate);
    const now = new Date();
    const years = now.getFullYear() - date.getFullYear();
    if (years < 1) {
        const months = now.getMonth() - date.getMonth() + 12 * years;
        if (months < 1) return '< 1 month';
        return `${months}mo`;
    }
    return `${years} yr${years > 1 ? 's' : ''}`;
}

/** Returns a short formatted date string, e.g. "26 Nov 2025". */
export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}
