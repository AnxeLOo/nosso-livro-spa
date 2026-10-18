export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function getDaysRemaining(dueIsoString: string): { days: number; isOverdue: boolean; label: string } {
  try {
    const now = new Date();
    const due = new Date(dueIsoString);
    const diffMs = due.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return {
        days: Math.abs(days),
        isOverdue: true,
        label: `Atrasado há ${Math.abs(days)} dia(s)`,
      };
    } else if (days === 0) {
      return {
        days: 0,
        isOverdue: false,
        label: 'Devolver hoje',
      };
    } else {
      return {
        days,
        isOverdue: false,
        label: `${days} dia(s) restante(s)`,
      };
    }
  } catch {
    return { days: 0, isOverdue: false, label: 'Data indisponível' };
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
