import { cloneElement, isValidElement, useId } from 'react';

export default function Tooltip({ text, children, side = 'bottom', align = 'center', className = '' }) {
  const id = useId();
  return (
    <span className={`ui-tooltip-anchor relative inline-flex min-w-0 ${className}`} aria-describedby={id}>
      {isValidElement(children) ? cloneElement(children, { 'aria-describedby': id }) : children}
      <span role='tooltip' id={id} className={`ui-tooltip whitespace-normal ${side === 'top' ? 'bottom-[calc(100%+.5rem)]' : 'top-[calc(100%+.5rem)]'} ${align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2'}`}>
        {text}
      </span>
    </span>
  );
};