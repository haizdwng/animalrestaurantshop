import { toast } from '@/shared/components/ui/Toast';

export const copyText = (text, msg) => navigator.clipboard?.writeText(text).then(() => toast(msg, 'info'));