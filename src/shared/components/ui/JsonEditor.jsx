import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { IconBraces, IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';
import Button from '@/shared/components/ui/Button';
import { ErrorState, Spinner } from '@/shared/components/ui/Feedback';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { toast, toastError } from '@/shared/components/ui/Toast';

const formatJson = (value) => JSON.stringify(value, null, 2);
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
  const current = useRef({ parseError: '', dirty: false, save: null });
  const request = useRef(0);
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
    <section className={`ui-card min-w-0 overflow-hidden ${parseError ? 'ring-1 ring-bad/40 ring-inset' : ''}`}>
      <div className='flex flex-wrap items-center justify-end gap-2 border-b border-line p-3'>
        {extraActions}
        <Button variant='quiet' size='sm' onClick={reload} disabled={saving}><IconRefresh size={15} /> Tải lại</Button>
        <Button variant='ghost' size='sm' onClick={format} disabled={Boolean(parseError)}>Định dạng</Button>
        <Button size='sm' onClick={submit} loading={saving} disabled={!dirty || Boolean(parseError)}><IconDeviceFloppy size={15} /> Lưu</Button>
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
  );
};