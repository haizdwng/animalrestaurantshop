import { IconLoader2 } from '@tabler/icons-react';
import useRequestPending from '@/shared/hooks/useRequestPending';
import { getPendingRequestCount } from '@/shared/library/api/client';

const VARIANTS = {
  solid: 'border border-transparent bg-lime text-bg hover:brightness-105',
  danger: 'border border-transparent bg-bad text-bg hover:brightness-105',
  ghost: 'border border-line bg-raise text-fg hover:border-mute hover:bg-panel',
  quiet: 'border border-transparent text-mute hover:bg-raise hover:text-fg'
};
const SIZES = { sm: 'min-h-8 px-3 text-xs', md: 'min-h-11 px-4 text-sm' };

function childText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childText).join(' ');
  return node && typeof node === 'object' ? childText(node.props?.children) : '';
};

function isRequestButton(type, variant, label) {
  if (type === 'submit') return true;
  if (/^(Tải lại|Làm mới|Kiểm tra|Thử lại|Lưu JSON|Đặt làm ảnh đại diện|Nhận \+|Mua tất cả)/i.test(label)) return true;
  return variant === 'danger' && /^(Xóa|Xoá|Hủy giao dịch|Huỷ giao dịch)/i.test(label);
};

export default function Button({ variant = 'solid', size = 'md', className = '', loading = false, requestAction, children, ...props }) {
  const requestPending = useRequestPending();
  const label = [props['aria-label'], props.title, childText(children)].filter(Boolean).join(' ').trim();
  const requestControl = requestAction ?? isRequestButton(props.type, variant, label);
  const disabled = Boolean(props.disabled || loading || (requestControl && requestPending));
  const { onClick, ...buttonProps } = props;
  const handleClick = (event) => {
    if (requestControl && getPendingRequestCount() > 0) {
      event.preventDefault();
      event.stopPropagation();
      return;
    };
    onClick?.(event);
  };

  return (
    <button
      {...buttonProps}
      type={props.type || 'button'}
      onClick={handleClick}
      disabled={disabled}
      aria-busy={loading || undefined}
      data-request-action={requestControl ? '' : undefined}
      className={`inline-flex min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg font-bold leading-tight transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:cursor-not-allowed disabled:opacity-50 ${SIZES[size] || SIZES.md} ${VARIANTS[variant] || VARIANTS.solid} ${className}`}
    >
      {loading ? <IconLoader2 size={16} className='shrink-0 animate-spin' aria-hidden /> : children}
      {loading && <span className='sr-only'>Đang xử lý</span>}
    </button>
  );
};