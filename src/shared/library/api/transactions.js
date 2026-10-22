import { call, enc } from '@/shared/library/api/client';

export const MIN_TOPUP = 20;

export const createTransaction = (coin) => call('POST', '/user/transactions', { coin });
export const getTransaction = async (code) => {
  const r = await call('GET', `/user/transactions/${enc(code)}`);
  const tx = r.transaction || {};
  return { ...r, transaction: tx, status: String(tx.status ?? r.status ?? 'pending').toLowerCase() };
};
export const cancelTransaction = (code) => call('DELETE', `/user/transactions/${enc(code)}`);
export const getTransactions = async () => {
  const r = await call('GET', '/user/transactions');
  return { ...r, transactions: (r.transactions || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) };
};