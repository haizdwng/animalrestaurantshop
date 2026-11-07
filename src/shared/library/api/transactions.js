import { call, enc } from '@/shared/library/api/client';

export const MIN_TOPUP = 20;

export const createTransaction = (coin) => call('POST', '/user/transactions', { coin });
export const getTransaction = async (code) => {
  const r = await call('GET', `/user/transactions/${enc(code)}`);
  const tx = r.transaction || {};
  const status = String(tx.status ?? r.status ?? 'pending').toLowerCase();
  return { ...r, transaction: { ...tx, expiredAt: tx.expiredAt ?? r.expiredAt }, status };
};
export const cancelTransaction = (code) => call('DELETE', `/user/transactions/${enc(code)}`);
export const getTransactions = async () => {
  const r = await call('GET', '/user/transactions');
  const transactions = (r.transactions || []).map((t) => ({
    ...t,
    status: String(t.status ?? 'pending').toLowerCase(),
    expiredAt: t.expiredAt || null
  })).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return { ...r, transactions };
};