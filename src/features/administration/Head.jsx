import { Children, cloneElement, isValidElement } from 'react';
import { Button } from '@/shared/components/ui';

function renderIconActions(element) {
  if (!isValidElement(element)) return element;

  if (element.type === Button) {
    const nodes = Children.toArray(element.props.children);
    const icon = nodes.find(isValidElement);
    if (!icon) return element;

    const label = element.props['aria-label'] || nodes.filter((node) => typeof node === 'string').join(' ').trim();
    if (!label) return element;

    const button = cloneElement(element, {
      'aria-label': label,
      title: label,
      className: 'size-9! shrink-0 p-0!',
      children: icon
    });
    return button;
  };

  if (element.props.children === undefined) return element;
  return cloneElement(element, undefined, Children.map(element.props.children, renderIconActions));
};

export default function Head({ title, sub, children }) {
  return (
    <header className='flex min-w-0 items-center justify-between gap-3'>
      <div className='min-w-0 flex-1 space-y-1'>
        <h1 className='ui-heading'>{title}</h1>
        {sub && <p className='ui-description'>{sub}</p>}
      </div>
      {children && <div className='flex shrink-0 items-center gap-2'>{renderIconActions(children)}</div>}
    </header>
  );
};