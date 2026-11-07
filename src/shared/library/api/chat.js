import { call, enc } from '@/shared/library/api/client';

// Polling calls are silent so they never trigger the global "request pending" lock.
export const getChat = () => call('GET', '/user/chat', undefined, { silent: true });
export const sendChat = (text) => call('POST', '/user/chat', { text });

export const adminChats = () => call('GET', '/administrator/chat', undefined, { silent: true });
export const adminChatThread = (userId) => call('GET', `/administrator/chat/${enc(userId)}`, undefined, { silent: true });
export const adminSendChat = (userId, text) => call('POST', `/administrator/chat/${enc(userId)}`, { text });
export const adminDeleteChat = (userId, messageId) => call('DELETE', `/administrator/chat/${enc(userId)}/messages/${enc(messageId)}`);
export const adminBanChat = (userId, banned) => call('PATCH', `/administrator/chat/${enc(userId)}/ban`, { banned });
