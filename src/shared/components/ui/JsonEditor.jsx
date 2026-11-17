import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { IconBraces, IconDeviceFloppy, IconFileUpload, IconRefresh } from '@tabler/icons-react';
import Button from '@/shared/components/ui/Button';
import Dialog from '@/shared/components/ui/Dialog';
import { ErrorState, Spinner } from '@/shared/components/ui/Feedback';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { toast, toastError } from '@/shared/components/ui/Toast';

const formatJson = (value) => JSON.stringify(value, null, 2);
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const EDITOR_HEIGHT = 'h-[clamp(22rem,62dvh,48rem)] min-h-72';
const LOADING_WIDTHS = [40, 62, 55, 70, 48, 66, 35, 58, 44, 30];
const EDITOR_OPTIONS = {
  automaticLayout: true,
  minimap: { enabled: false },
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: 12,
  lineHeight: 20,
  lineNumbers: 'off',
  roundedSelection: false,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  wrappingIndent: 'indent',
  tabSize: 2,
  insertSpaces: true,
  formatOnPaste: true,
  formatOnType: false,
  quickSuggestions: false
};

function applyEditorTheme(monaco) {
  const styles = getComputedStyle(document.documentElement);
  const token = (name, fallback) => styles.getPropertyValue(name).trim() || fallback;
  monaco.editor.defineTheme('animal-restaurant-shop', {
    base: 'vs-dark', inherit: true, rules: [],
    colors: {
      'editor.background': token('--color-bg', '#0e1012'),
      'editor.foreground': token('--color-fg', '#f1f2f3'),
      'editorLineNumber.foreground': token('--color-mute', '#a3a8b0'),
      'editorCursor.foreground': token('--color-lime', '#d4ff3a'),
      'editor.selectionBackground': '#3b4641',
      'editor.inactiveSelectionBackground': '#2a3230',
      'editorWidget.background': token('--color-panel', '#17191c'),
      'editorWidget.border': token('--color-line', '#353940'),
      'input.background': token('--color-panel', '#17191c'),
      'input.foreground': token('--color-fg', '#f1f2f3')
    }
  });
  monaco.editor.setTheme('animal-restaurant-shop');
};

function EditorSkeleton() {
  return (
    <section role='status' aria-busy='true' className='ui-card overflow-hidden'>
      <header className='flex items-center gap-2 border-b border-line p-3'>
        <Spinner size={15} /> <span className='mr-auto text-xs text-mute'>Đang tải dữ liệu…</span>
        <Skeleton className='h-8 w-20' /><Skeleton className='h-8 w-20' />
      </header>
      <div className={`${EDITOR_HEIGHT} space-y-2.5 bg-bg p-4`}>
        {LOADING_WIDTHS.map((width, index) => <Skeleton key={index} className='h-3' style={{ width: `${width}%`, marginLeft: `${(index % 3) * 1.5}rem` }} />)}
      </div>
    </section>
  );
};

export default function JsonEditor({ load, save, deps = [], extraActions = null }) {
  const [text, setText] = useState('');
  const [original, setOriginal] = useState('');
  const [state, setState] = useState({ loading: true, error: '' });
  const [saving, setSaving] = useState(false);
  const [confirmReload, setConfirmReload] = useState(false);
  const current = useRef({ parseError: '', dirty: false, save: null });
  const request = useRef(0);
  const uploadInput = useRef(null);
  const loadRef = useRef(load);
  loadRef.current = load;

  const reload = async () => {
    const requestId = ++request.current;
    setState({ loading: true, error: '' });
    try {
      const formatted = formatJson((await loadRef.current()) ?? null);
      if (requestId !== request.current) return;
      setText(formatted);
      setOriginal(formatted);
      setState({ loading: false, error: '' });
    } catch (error) {
      if (requestId === request.current) setState({ loading: false, error: error?.message || 'Không tải được JSON' });
    };
  };

  useEffect(() => {
    reload();
    return () => { request.current += 1; };
  }, deps);

  let parseError = '';
  try {
    if (!state.loading && !state.error) JSON.parse(text);
  } catch (error) {
    parseError = error?.message || 'JSON không hợp lệ';
  };
  const dirty = text !== original;
  const submit = async () => {
    if (!dirty || parseError || saving) return;
    setSaving(true);
    try {
      const json = JSON.parse(text);
      const result = await save(json);
      const formatted = formatJson(json);
      setOriginal(formatted);
      setText(formatted);
      toast(result?.message || 'Đã lưu dữ liệu');
    } catch (error) {
      toastError(error);
    } finally {
      setSaving(false);
    };
  };
  const format = () => {
    if (parseError) return;
    setText(formatJson(JSON.parse(text)));
  };

  const importFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.json')) {
      toast('Chỉ hỗ trợ tệp .json', 'err');
      return;
    };
    if (file.size > MAX_UPLOAD_BYTES) {
      toast('Tệp JSON không được vượt quá 20 MB', 'err');
      return;
    };
    try {
      const fileText = await file.text();
      const parsed = JSON.parse(fileText.replace(/^\uFEFF/, ''));
      setText(formatJson(parsed));
      toast(`Đã nạp ${file.name}. Bấm Lưu để cập nhật lên máy chủ.`, 'info');
    } catch (error) {
      toast(`Không thể đọc JSON: ${error.message}`, 'err');
    };
  };
  current.current = { parseError, dirty, save: submit };

  const onMount = (editor, monaco) => {
    applyEditorTheme(monaco);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const snapshot = current.current;
      if (!snapshot.parseError && snapshot.dirty) snapshot.save?.();
    });
  };

  if (state.loading) return <EditorSkeleton />;
  if (state.error) return <ErrorState message={state.error} onRetry={reload} />;

  return (
    <>
    <section className={`ui-card min-w-0 overflow-hidden ${parseError ? 'ring-1 ring-bad/40 ring-inset' : ''}`}>
      <div role='toolbar' aria-label='Công cụ dữ liệu JSON' className='flex min-w-0 items-center justify-end gap-2 border-b border-line px-3 py-2.5'>
        {extraActions}
        <input ref={uploadInput} type='file' accept='.json,application/json' className='sr-only' tabIndex={-1} aria-label='Chọn tệp JSON để nhập' onChange={importFile} />
        <Button variant='ghost' size='sm' className='size-9! shrink-0 p-0!' aria-label='Tải lại' title='Tải lại' onClick={() => dirty ? setConfirmReload(true) : reload()} disabled={saving}><IconRefresh size={17} /></Button>
        <Button variant='ghost' size='sm' className='size-9! shrink-0 p-0!' aria-label='Định dạng JSON' title='Định dạng JSON' onClick={format} disabled={Boolean(parseError) || saving}><IconBraces size={17} /></Button>
        <Button variant='ghost' size='sm' className='size-9! shrink-0 p-0!' aria-label='Nhập tệp JSON' title='Nhập tệp JSON' onClick={() => uploadInput.current?.click()} disabled={saving}><IconFileUpload size={17} /></Button>
        <Button size='sm' className='size-9! shrink-0 p-0!' aria-label='Lưu JSON' title='Lưu JSON' onClick={submit} loading={saving} disabled={!dirty || Boolean(parseError)}><IconDeviceFloppy size={17} /></Button>
      </div>
      {parseError && (
        <div role='alert' className='flex items-start gap-2 border-b border-bad/30 bg-bad/10 px-4 py-3 text-xs text-bad'>
          <IconBraces size={17} className='mt-0.5 shrink-0' />
          <div className='min-w-0'><p className='font-bold'>JSON không hợp lệ</p><p className='mt-1 wrap-break-word'>{parseError}</p></div>
        </div>
      )}
      <div className={EDITOR_HEIGHT}>
        <Editor value={text} onChange={(value) => setText(value ?? '')} language='json' theme='animal-restaurant-shop'
          options={EDITOR_OPTIONS} onMount={onMount}
          loading={<div className='grid size-full place-items-center bg-bg text-xs text-mute'>Đang khởi tạo trình chỉnh sửa…</div>} />
      </div>
    </section>
    <Dialog open={confirmReload} title='Tải lại dữ liệu' onClose={() => setConfirmReload(false)}>
      <p className='text-sm text-mute'>Các thay đổi chưa lưu sẽ bị mất. Bạn có muốn tải lại dữ liệu từ máy chủ?</p>
      <div className='grid grid-cols-2 gap-2'>
        <Button variant='ghost' onClick={() => setConfirmReload(false)}>Hủy</Button>
        <Button onClick={() => { setConfirmReload(false); reload(); }}>Tải lại</Button>
      </div>
    </Dialog>
    </>
  );
};