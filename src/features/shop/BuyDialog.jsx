import { useEffect, useState } from 'react';
import { IconCheck, IconLock, IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Dialog } from '@/shared/components/ui';
import { cartLineId, createCartLine, effectiveDisplay, findLine, hasOptions, initialSelections, lineMaximum, nodeType, ownedLabel, resolveCart } from '@/features/shop/cartUtils';
import QuantityPicker from '@/features/shop/QuantityPicker';
import ShopNodeSelector from '@/features/shop/ShopNodeSelector';
import Tile from '@/features/shop/Tile';

function describeSelection(node, selections, ancestors = []) {
  if (!node || !selections) return [];
  const items = [];
  for (const [key, selected] of Object.entries(selections)) {
    const child = node.options?.[key];
    if (!child) continue;
    items.push({ node: child, ancestors: [...ancestors, node] });
    items.push(...describeSelection(child, selected, [...ancestors, node]));
  };
  return items;
};

export default function BuyDialog({ item, category, tabs, user, entries = [], editLine = null, maxQuantity = 100, now = Date.now(), onAdd, onRemove, onClose, onTopUp }) {
  const [selections, setSelections] = useState(() => editLine?.selections ?? initialSelections(item, false, now));
  const [amount, setAmount] = useState(() => editLine?.amount ?? 1);
  useEffect(() => {
    setSelections(editLine?.selections ?? initialSelections(item, false, now));
    setAmount(editLine?.amount ?? 1);
  }, [item, editLine?.lineId]);

  const draft = item && category ? createCartLine(category.id, item.key, amount, selections) : null;
  const baseline = entries.filter((line) => line.lineId !== editLine?.lineId);
  const sameLine = draft ? findLine(baseline, draft) : null;
  const candidate = draft ? createCartLine(draft.category, draft.key, amount + (sameLine?.amount || 0), selections) : null;
  const candidateId = draft ? cartLineId(draft) : '';
  const previousLines = baseline.filter((line) => line.lineId !== candidateId && !(nodeType(item) === 'single' && line.category === candidate?.category && line.key === candidate?.key));
  const prepared = candidate ? [...previousLines, candidate] : previousLines;
  const checked = resolveCart(prepared, tabs, maxQuantity, now);
  const resolved = candidate ? checked[checked.length - 1] : null;
  const maxTotal = resolved ? lineMaximum(resolved, checked, maxQuantity) : 0;
  const max = Math.max(0, maxTotal - (sameLine?.amount || 0));
  const limit = Math.max(1, max);
  const shortage = Math.max(0, checked.reduce((sum, line) => sum + line.subtotal, 0) - Number(user?.coins || 0));
  const possible = !!resolved && !resolved.invalid && amount <= max && max > 0 && checked.every((line) => !line.invalid);
  const selected = item ? describeSelection(item, selections) : [];
  const details = item ? effectiveDisplay(item) : {};
  const lastChoice = selected.at(-1);
  const unit = lastChoice ? effectiveDisplay(lastChoice.node, lastChoice.ancestors).unit ?? details.unit : details.unit;
  const allConditions = item ? [item, ...selected.map(({ node }) => node)].flatMap((node) => node.conditions || []) : [];
  const cartAmount = sameLine?.amount ?? 0;

  const add = () => {
    if (!possible) return;
    onAdd(draft, editLine?.lineId);
  };
  const remove = () => {
    if (!editLine && !sameLine) return;
    onRemove(editLine?.lineId || candidateId);
    onClose();
  };

  return (
    <Dialog open={!!item} title={editLine ? 'Sửa vật phẩm trong giỏ' : 'Chi tiết vật phẩm'} onClose={onClose}>
      {item && (
        <div className='space-y-4'>
          <div className='flex items-start gap-3'>
            <Tile p={item} size='lg' />
            <div className='min-w-0 flex-1'>
              <p className='text-[11px] text-mute'>{category?.name}</p>
              <h3 className='text-base leading-tight font-extrabold'>{item.name || item.key}</h3>
              <p className='mt-1 break-all font-mono text-[10px] text-mute'>{item.key}</p>
              {ownedLabel(item) && <p className='mt-1 text-[11px] text-coin'>{ownedLabel(item)}</p>}
              {details.description?.trim() && <p className='mt-2 text-xs leading-relaxed text-mute'>{details.description}</p>}
            </div>
          </div>

          {hasOptions(item) && <ShopNodeSelector node={item} selections={selections} onChange={(next) => { setSelections(next); setAmount(1); }} />}

          {selected.length > 0 && (
            <div className='space-y-1.5 rounded-xl border border-line bg-bg p-3'>
              <p className='text-[11px] font-bold'>Cấu hình đã chọn</p>
              {selected.map(({ node, ancestors }, index) => {
                const display = effectiveDisplay(node, ancestors);
                return <div key={`${index}:${node.key}`} className='flex min-w-0 flex-wrap items-center justify-between gap-2 text-xs'>
                  <span className='min-w-0 wrap-break-word text-mute'>{node.name || node.key}</span>
                  <span className='shrink-0 text-[11px]'>{ownedLabel(node)}{display.unit && typeof node.owned === 'number' ? ` ${display.unit}` : ''}</span>
                </div>;
              })}
            </div>
          )}

          {allConditions.length > 0 && (
            <div className='space-y-2 rounded-xl border border-line bg-bg p-3'>
              <p className='text-[11px] font-bold'>Điều kiện mua</p>
              {allConditions.map(({ name, met }, index) => <p key={`${name}:${index}`} className='flex items-start gap-2 text-[11px]'>
                {met ? <IconCheck size={15} className='shrink-0 text-ok' /> : <IconX size={15} className='shrink-0 text-bad' />}
                <span className={met ? 'text-mute' : 'text-bad'}>{name}</span>
              </p>)}
            </div>
          )}

          {item.startTime != null || item.endTime != null || selected.some(({ node }) => node.startTime != null || node.endTime != null) ? (
            <div className='space-y-1 rounded-xl border border-line bg-bg p-3 text-[11px] text-mute'>
              <p className='font-bold text-fg'>Thời gian mở bán (theo toàn bộ đường dẫn)</p>
              {[item, ...selected.map(({ node }) => node)].filter((node) => node.startTime != null || node.endTime != null).map((node, index) => (
                <p key={index} className='wrap-break-word'>{node.name || node.key}: {node.startTime != null ? `Từ ${new Date(node.startTime).toLocaleString('vi-VN')}` : 'Không giới hạn bắt đầu'} · {node.endTime != null ? `Đến ${new Date(node.endTime).toLocaleString('vi-VN')}` : 'Không giới hạn kết thúc'}</p>
              ))}
            </div>
          ) : null}

          <p className='text-[11px] text-mute'>Đơn vị mua: {unit || 'cái'}</p>
          {max === 0 ? <p className='rounded-lg border border-bad/40 bg-bad/10 p-3 text-[11px] text-bad'>Đã hết số lượng được phép mua.</p> : (
            <QuantityPicker value={amount} max={limit} onChange={setAmount} onEnter={add} />
          )}

          {resolved?.invalid && <p role='alert' className='rounded-lg border border-bad/40 bg-bad/10 p-3 text-xs text-bad'>{resolved.invalid}</p>}
          {nodeType(item) === 'multiple' && <p className='text-[11px] text-mute'>Bạn có thể chọn loại khác và thêm tiếp. Mỗi loại sẽ là một dòng đơn hàng riêng.</p>}
          <div className='rounded-xl border border-line bg-bg p-3'>
            <div className='flex items-center justify-between text-xs'>
              <span>Đơn giá</span><span className='flex items-center gap-1 font-bold text-coin'><Coin size={14} /> {formatNumber(resolved?.unitPrice || 0)}</span>
            </div>
            <div className='mt-2 flex items-center justify-between border-t border-line pt-2'>
              <span className='text-xs font-bold'>Thành tiền</span>
              <span className='flex items-center gap-1 text-lg font-extrabold tabular-nums text-coin'><Coin size={18} /> {formatNumber(resolved?.subtotal || 0)}</span>
            </div>
          </div>
          {shortage > 0 && <div className='flex flex-wrap items-center justify-between gap-2 rounded-lg border border-coin/30 bg-coin/10 p-3 text-[11px]'>
            <span className='text-coin'>Giỏ hàng sẽ thiếu {formatNumber(shortage)} xu</span>
            <button type='button' onClick={onTopUp} className='cursor-pointer font-bold text-coin underline underline-offset-2'>Mua xu</button>
          </div>}
          <div className={`grid gap-2 ${editLine || sameLine ? 'grid-cols-2' : ''}`}>
            {(editLine || sameLine) && <Button variant='ghost' className='w-full text-bad!' onClick={remove}><IconTrash size={15} /> Xóa khỏi giỏ</Button>}
            <Button className='w-full' disabled={!possible} onClick={add}>
              {possible ? <IconShoppingCart size={16} /> : <IconLock size={16} />}
              {editLine ? 'Cập nhật giỏ' : cartAmount ? 'Thêm số lượng' : 'Thêm vào giỏ'}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};