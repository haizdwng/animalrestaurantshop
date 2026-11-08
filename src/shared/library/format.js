export const formatNumber = (n) => Number(n || 0).toLocaleString('vi-VN');
export const formatVietnameseDong = (n) => `${formatNumber(n)}₫`;

export const formatShortDateTime = (t) => new Date(t).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
export const formatDateTime = (t) => (t ? new Date(t).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—');
export const formatDate = (t) => new Date(t).toLocaleDateString('vi-VN')

export const compareByTime = (k, dir) => (a, b) => dir * ((+new Date(a[k]) || 0) - (+new Date(b[k]) || 0));