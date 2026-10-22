import { useEffect, useMemo, useState } from 'react';
import { IconPencil, IconPlus, IconDeviceFloppy, IconRefresh, IconTrash } from '@tabler/icons-react';
import { Button, Coin, Dialog, ErrorState, Field, Menu, Skeleton, Spinner, toast, toastError } from '@/shared/components/ui';
import { formatNumber } from '@/shared/library/format';
import { normShop } from '@/shared/library/api/normalize';
import Tile from '@/features/shop/Tile';
import * as api from '@/shared/library/api';

const EMPTY_FORM = { id: '', name: '', price: '0' };
const shopData = (value) => (value || []).reduce((result, category) => ({
  ...result,
  [category.id]: category.products
}), {});

function ShopEditorSkeleton() {
  return (
    <div aria-busy='true' aria-label='Đang tải dữ liệu cửa hàng' className='space-y-4'>
      <div className='flex items-center justify-end gap-2'>
        <Skeleton className='size-8 shrink-0 rounded-lg' />
        <Skeleton className='h-8 min-w-0 flex-1 rounded-lg sm:w-32 sm:flex-none' />
      </div>
      {Array.from({ length: 3 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className='min-w-0 rounded-2xl border border-line bg-panel p-4 sm:p-5'>
          <div className='mb-3 flex min-w-0 items-center justify-between gap-3'>
            <div className='min-w-0 flex-1 space-y-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-2.5 w-20' />
            </div>
            <Skeleton className='h-8 w-16 rounded-lg' />
          </div>
          <ul className='grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <li key={cardIndex} className='flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-line bg-panel p-3'>
                <Skeleton className='size-12 shrink-0 rounded-xl' />
                <div className='min-w-0 flex-1 space-y-2'>
                  <Skeleton className='h-3 w-3/4' />
                  <Skeleton className='h-2.5 w-1/2' />
                </div>
                <div className='flex shrink-0 flex-col items-end gap-2'>
                  <Skeleton className='h-3.5 w-10' />
                  <Skeleton className='size-7 rounded-lg' />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

function ProductCard({ product, onEdit, onDelete, disabled }) {
  return (
    <li className='flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-line bg-panel p-3'>
      <Tile p={product} />
      <div className='min-w-0 flex-1'>
        <p className='line-clamp-2 text-[13px] font-bold'>{product.name}</p>
        <p className='mt-0.5 truncate text-[10px] text-mute'>{product.id}</p>
      </div>
      <div className='flex shrink-0 flex-col items-end gap-2'>
        <span className='flex max-w-full items-center gap-1 text-xs font-bold tabular-nums text-coin'>
          <Coin size={14} /> {formatNumber(product.price)}
        </span>
        <Menu
          items={[
            { label: 'Sửa', Icon: IconPencil, onClick: onEdit, hidden: disabled },
            { label: 'Xóa', Icon: IconTrash, danger: true, onClick: onDelete, hidden: disabled }
          ]}
          label={`Tùy chọn ${product.name}`}
        />
      </div>
    </li>
  );
};

function ProductDialog({ category, form, setForm, onClose, onSubmit, editing, disabled }) {
  return (
    <Dialog open={!!category} title={editing ? 'Sửa vật phẩm' : 'Thêm vật phẩm'} onClose={onClose}>
      <form className='space-y-4' onSubmit={onSubmit}>
        <Field label='Mã vật phẩm' value={form.id} disabled={disabled} required onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))} />
        <Field label='Tên vật phẩm' value={form.name} disabled={disabled} required onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <Field label='Giá' type='number' min='0' step='1' value={form.price} disabled={disabled} required onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
        <Button type='submit' className='w-full' disabled={disabled}>
          {editing ? 'Cập nhật vật phẩm' : 'Thêm vật phẩm'}
        </Button>
      </form>
    </Dialog>
  );
};

export default function ShopEditor() {
  const [shop, setShop] = useState(null);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const busy = loading || saving;

  const load = async () => {
    if (saving) return;
    setLoading(true);
    setError('');
    setDialog(null);
    try {
      const raw = (await api.adminData('shop')).shop;
      setOriginal(raw || {});
      setShop(normShop(raw));
    } catch (e) {
      setError(e.message || 'Không tải được dữ liệu cửa hàng');
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = (category) => {
    if (busy) return;
    setForm({ id: `${category.id}_${category.products.length + 1}`, name: `${category.id.charAt(0).toUpperCase() + category.id.slice(1)} ${category.products.length + 1}`, price: 0 });
    setDialog({ category: category.id, product: null });
  };
  const openEdit = (category, product) => {
    if (busy) return;
    setForm({ id: product.id, name: product.name, price: String(product.price ?? 0) });
    setDialog({ category: category.id, product });
  };
  const close = () => setDialog(null);
  const closeDelete = () => !saving && setDeleteTarget(null);

  const submit = (event) => {
    event.preventDefault();
    if (busy || !dialog) return;
    const id = form.id.trim();
    const name = form.name.trim();
    const price = Number(form.price);
    if (!id || !name || !Number.isFinite(price) || price < 0) {
      toast('Nhập đầy đủ mã, tên và giá hợp lệ', 'err');
      return;
    };
    const duplicate = shop
      .find((category) => category.id === dialog.category)
      ?.products.some((item) => item.id === id && item !== dialog.product);
    if (duplicate) {
      toast('Mã vật phẩm đã tồn tại trong danh mục này', 'err');
      return;
    };
    setShop((current) => current.map((category) => {
      if (category.id !== dialog.category) return category;
      const product = { ...(dialog.product || {}), id, name, price };
      const products = dialog.product
        ? category.products.map((item) => item.id === dialog.product.id ? product : item)
        : [...category.products, product];
      return { ...category, products };
    }));
    close();
  };

  const remove = () => {
    if (busy || !deleteTarget) return;
    setShop((current) => current.map((category) => (
      category.id === deleteTarget.category
        ? { ...category, products: category.products.filter((item) => item !== deleteTarget.product) }
        : category
    )));
    setDeleteTarget(null);
  };

  const payload = useMemo(() => {
    if (!shop) return null;
    return { ...(original || {}), ...shopData(shop) };
  }, [shop, original]);
  const dirty = useMemo(() => {
    if (!shop || !original) return false;
    return JSON.stringify(shopData(shop)) !== JSON.stringify(shopData(normShop(original)));
  }, [shop, original]);

  const save = async () => {
    if (busy || !payload || !dirty) return;
    setSaving(true);
    try {
      const result = await api.adminSaveData('shop', payload);
      toast(result?.message || 'Đã lưu dữ liệu cửa hàng');
      setOriginal(payload);
    } catch (e) {
      toastError(e);
    } finally {
      setSaving(false);
    };
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (!busy && dirty) save();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [busy, dirty, payload]);

  if (loading && !shop) return <ShopEditorSkeleton />;
  if (error && !shop) return <ErrorState message={error} onRetry={load} loading={loading} />;

  return (
    <>
      <div aria-busy={loading || saving} className='space-y-4'>
        <div className='flex items-center justify-end gap-2'>
          <Button variant='ghost' size='sm' className='size-8! p-0!' onClick={load} disabled={loading || saving} aria-label='Làm mới'>
            {loading ? <Spinner size={14} /> : <IconRefresh size={14} />}
          </Button>
          <Button size='sm' className='min-w-0 flex-1 sm:w-auto sm:flex-none' loading={saving} disabled={busy || !dirty} onClick={save}><IconDeviceFloppy size={15} /> Lưu thay đổi</Button>
        </div>
        <div className={`space-y-4 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {shop.map((category) => (
            <section key={category.id} className='min-w-0 rounded-2xl border border-line bg-panel p-4 sm:p-5'>
              <div className='mb-3 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between'>
              <div>
                <h2 className='text-sm font-extrabold'>{category.name}</h2>
                <p className='mt-0.5 text-[11px] text-mute'>{category.products.length} vật phẩm</p>
              </div>
                <Button size='sm' className='w-full min-[380px]:w-auto' onClick={() => openAdd(category)} disabled={busy}><IconPlus size={15} /> Thêm</Button>
              </div>
              {category.products.length ? (
                <ul className='grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3'>
                  {category.products.map((product) => <ProductCard key={product.id} product={product} disabled={busy} onEdit={() => openEdit(category, product)} onDelete={() => setDeleteTarget({ category: category.id, product })} />)}
                </ul>
              ) : (
                <p className='rounded-xl border border-dashed border-line p-6 text-center text-xs text-mute'>Chưa có vật phẩm nào</p>
              )}
            </section>
          ))}
        </div>
      </div>
      <ProductDialog
        category={dialog}
        form={form}
        setForm={setForm}
        onClose={close}
        onSubmit={submit}
        editing={!!dialog?.product}
        disabled={busy}
      />
      <Dialog open={!!deleteTarget} title='Xóa vật phẩm' onClose={closeDelete}>
        <p className='text-sm text-mute'>
          Xóa vật phẩm <b className='text-fg'>{deleteTarget?.product?.name}</b>? Hành động này không thể hoàn tác.
        </p>
        <div className='grid grid-cols-2 gap-2'>
          <Button variant='ghost' onClick={closeDelete}>Hủy</Button>
          <Button variant='danger' loading={saving} disabled={busy} onClick={remove}>Xóa</Button>
        </div>
      </Dialog>
    </>
  );
};