import { useId } from 'react';
import { IconCheck, IconLock } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { effectiveDisplay, initialSelections, nodeType, ownedLabel } from '@/features/shop/cartUtils';
import Tile from '@/features/shop/Tile';

const has = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);

function OptionLabel({ node, inheritedPrice, inheritedDisplay }) {
  const price = node.price === undefined ? inheritedPrice : node.price;
  const owned = ownedLabel(node);
  const display = effectiveDisplay(node, [inheritedDisplay]);
  const blocked = node.canPurchase === false || node.conditions?.some((condition) => condition.met !== true);
  return (
    <div className='flex min-w-0 flex-1 items-start gap-2'>
      {display.image && <Tile p={{ ...node, image: display.image }} />}
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <span className='flex min-w-0 flex-wrap items-center gap-2 text-xs font-semibold'>
          <span className='min-w-0 wrap-break-word'>{node.name || node.key}</span>
          {blocked && <IconLock size={13} className='text-bad' />}
        </span>
        {node.description?.trim() && <span className='text-[11px] leading-relaxed text-mute'>{node.description}</span>}
        <span className='flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-mute'>
          {owned && <span>{owned}{typeof node.owned === 'number' && display.unit ? ` ${display.unit}` : ''}</span>}
          {price !== undefined && <span className='font-semibold text-coin'>{formatNumber(price)} xu</span>}
        </span>
      </div>
    </div>
  );
};

export default function ShopNodeSelector({ node, selections = {}, onChange, insideGrouped = false, inheritedPrice = 0, inheritedDisplay = {}, depth = 0 }) {
  const groupId = useId();
  const type = nodeType(node);
  const options = Object.entries(node.options || {});
  const activeKeys = Object.keys(selections);
  if (type === 'default') return null;
  if (depth >= 62) return <p role='alert' className='text-xs text-bad'>Cấu hình lựa chọn vượt độ sâu cho phép.</p>;
  const nextInheritedPrice = type === 'grouped' ? 0 : node.price ?? inheritedPrice;
  const nextInheritedDisplay = effectiveDisplay(node, [inheritedDisplay]);
  const update = (key, selection, checked, exclusive) => {
    const next = exclusive ? {} : { ...selections };
    if (checked) next[key] = selection;
    else delete next[key];
    onChange(next);
  };

  if (type === 'grouped') return (
    <fieldset className='min-w-0 space-y-3 rounded-xl border border-line bg-bg p-3 sm:p-4'>
      <legend className='px-1 text-xs font-extrabold'>{node.name || 'Các nhóm lựa chọn'}</legend>
      {node.description?.trim() && <p className='text-[11px] text-mute'>{node.description}</p>}
      {options.map(([key, child]) => {
        const required = child.required !== false;
        const active = has(selections, key);
        return (
          <div key={key} className='min-w-0 space-y-2 rounded-xl border border-line bg-panel p-3'>
            <label className='flex min-w-0 cursor-pointer items-center gap-2'>
              <input type='checkbox' checked={active} disabled={required && active} onChange={(event) => update(key, initialSelections(child, true), event.target.checked, false)} className='size-4 shrink-0 accent-lime' />
              <span className='min-w-0 flex-1 text-xs font-bold'>{child.name || key}</span>
              <span className='shrink-0 text-[10px] text-mute'>{required ? 'Bắt buộc' : 'Tùy chọn'}</span>
            </label>
            {active && <ShopNodeSelector node={child} selections={selections[key]} onChange={(value) => update(key, value, true, false)} insideGrouped inheritedPrice={0} inheritedDisplay={nextInheritedDisplay} depth={depth + 1} />}
          </div>
        );
      })}
      <p className='text-[10px] text-mute'>Chọn tổ hợp hoàn chỉnh. Giá sản phẩm bằng giá cơ bản cộng các tùy chọn đã chọn.</p>
    </fieldset>
  );

  const exclusive = type === 'single' || (type === 'multiple' && !insideGrouped);
  const maximum = node.maxSelections ?? options.length;
  const minimum = node.minSelections ?? (type === 'multiple' && insideGrouped ? 0 : 1);
  return (
    <fieldset className='min-w-0 space-y-2 rounded-xl border border-line bg-bg p-3 sm:p-4'>
      <legend className='px-1 text-xs font-extrabold'>{node.name || 'Lựa chọn'} · {exclusive ? 'Chọn 1' : `Chọn ${minimum}–${maximum}`}</legend>
      {node.description?.trim() && <p className='pb-1 text-[11px] text-mute'>{node.description}</p>}
      <div className='max-h-72 space-y-2 overflow-y-auto overscroll-contain pr-1'>
        {options.map(([key, child]) => {
          const checked = has(selections, key);
          const disabled = child.canPurchase === false || (child.conditions || []).some((condition) => condition.met !== true);
          return (
            <div key={key} className={`min-w-0 rounded-lg border ${checked ? 'border-lime/50 bg-lime/5' : 'border-line bg-panel'}`}>
              <label className={`flex min-w-0 items-start gap-3 p-3 ${disabled ? 'opacity-70' : 'cursor-pointer'}`}>
                <input
                  type={exclusive ? 'radio' : 'checkbox'} name={groupId} checked={checked} disabled={disabled || (!checked && !exclusive && activeKeys.length >= maximum)}
                  onChange={(event) => update(key, initialSelections(child, insideGrouped), event.target.checked, exclusive)}
                  className='mt-0.5 size-4 shrink-0 accent-lime'
                />
                <OptionLabel node={child} inheritedPrice={nextInheritedPrice} inheritedDisplay={nextInheritedDisplay} />
                {checked && <IconCheck size={16} className='mt-0.5 shrink-0 text-lime' />}
              </label>
              {checked && nodeType(child) !== 'default' && (
                <div className='border-t border-line px-3 pb-3 pt-2'>
                  <ShopNodeSelector node={child} selections={selections[key]} onChange={(value) => update(key, value, true, exclusive)} insideGrouped={insideGrouped} inheritedPrice={nextInheritedPrice} inheritedDisplay={nextInheritedDisplay} depth={depth + 1} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {type === 'multiple' && !insideGrouped && <p className='text-[10px] text-mute'>Mỗi loại được lưu thành một dòng giỏ hàng riêng, với số lượng độc lập.</p>}
    </fieldset>
  );
};