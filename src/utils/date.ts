function toDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'string') {
    return new Date(date);
  }
  return new Date(NaN);
}

function isValid(date: Date): boolean {
  return !isNaN(date.getTime());
}

export function formatDate(date: Date | string, fmt = 'PPP'): string {
  const d = toDate(date);
  if (!isValid(d)) return '';

  if (fmt === 'yyyy-MM-dd') {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  if (fmt === 'PPP p') {
    const dateStr = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${dateStr} at ${timeStr}`;
  }

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'PPP p');
}

export function formatRelativeDate(date: Date | string, baseDate: Date = new Date()): string {
  const d = toDate(date);
  if (!isValid(d)) return '';
  return timeAgo(d);
}

export function timeAgo(date: Date | string): string {
  const d = toDate(date);
  if (!isValid(d)) return '';

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) {
    return 'less than a minute ago';
  }
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  }
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  }
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
}
