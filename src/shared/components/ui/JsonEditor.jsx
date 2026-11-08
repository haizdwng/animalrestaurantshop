import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { IconBraces, IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';
import { ErrorState, Spinner } from '@/shared/components/ui/Feedback';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { toast, toastError } from '@/shared/components/ui/Toast';
import Button from '@/shared/components/ui/Button';

const pretty = (v) => JSON.stringify(v, null, 2);
const SKELETON_LINES = [40, 62, 55, 70, 48, 66, 35, 58, 44, 30];
const EDITOR_HEIGHT_CLASS = 'h-[clamp(22rem,62dvh,48rem)] min-h-72';
const MONACO_OPTIONS = {
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

function EditorSkeleton() {
  return (
    <div aria-busy='true' className='overflow-hidden rounded-2xl border border-line bg-panel'>
      <div className='flex flex-wrap items-center gap-2 border-b border-line px-3 py-2'>
        <span className='flex min-w-0 flex-1 items-center gap-1.5 text-[11px] text-mute'>
          <Spinner size={14} className='text-lime' /> Đang tải dữ liệu…
        </span>
        <Skeleton className='h-8 w-20 rounded-lg' />
        <Skeleton className='h-8 w-20 rounded-lg' />
        <Skeleton className='h-8 w-16 rounded-lg' />
      </div>
      <div className={`${EDITOR_HEIGHT_CLASS} space-y-2.5 bg-bg p-4`}>
        {SKELETON_LINES.map((w, i) => (
          <Skeleton key={i} className='h-3' style={{ width: `${w}%`, marginLeft: `${(i % 3) * 1.5}rem` }} />
        ))}
      </div>
    </div>
  );
};

export default function JsonEditor({ load, save, deps = [], extraActions = null }) {
  const [text, setText] = useState('');
  const [orig, setOrig] = useState('');
  const [state, setState] = useState({ loading: true, error: '' });
  const [saving, setSaving] = useState(false);
  const live = useRef({ parseErr: '', dirty: false, onSave: null });
  const bindCtrlS = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const current = live.current;
      if (!current.parseErr && current.dirty) current.onSave?.();
    });
  };

  const fetchIt = async () => {
    setState({ loading: true, error: '' });
    try {
      const t = pretty((await load()) ?? null);
      setText(t);
      setOrig(t);
      setState({ loading: false, error: '' });
    } catch (e) {
      setState({ loading: false, error: e.message });
    };
  };
  useEffect(() => {
    fetchIt();
  }, deps);

  let parseErr = '';
  try {
    if (!state.loading && !state.error) JSON.parse(text);
  } catch (e) {
    parseErr = e.message;
  };
  const dirty = text !== orig;
  const onSave = async () => {
    setSaving(true);
    try {
      const v = JSON.parse(text);
      const r = await save(v);
      const t = pretty(v);
      setText(t);
      setOrig(t);
      toast(r?.message || 'Đã lưu');
    } catch (e) {
      toastError(e);
    } finally {
      setSaving(false);
    };
  };
  const format = () => {
    try {
      setText(pretty(JSON.parse(text)));
    } catch {
    };
  };
  live.current = { parseErr, dirty, onSave };

  if (state.loading) return <EditorSkeleton />
  if (state.error) return <ErrorState message={state.error} onRetry={fetchIt} />
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-panel ${parseErr ? 'ring-1 ring-bad/40 ring-inset' : ''}`}>
      <div className='flex flex-wrap items-center justify-end gap-2 border-b border-line px-3 py-2'>
        {extraActions}
        <Button variant='quiet' size='sm' onClick={fetchIt} disabled={saving}>
          <IconRefresh size={13} /> Tải lại
        </Button>
        <Button variant='quiet' size='sm' onClick={format} disabled={!!parseErr}>
          Định dạng
        </Button>
        <Button size='sm' onClick={onSave} loading={saving} disabled={!dirty || !!parseErr}>
          <IconDeviceFloppy size={14} /> Lưu
        </Button>
      </div>
      {parseErr && (
        <div role='alert' className='flex items-start gap-2 border-b border-bad/30 bg-bad/10 px-3 py-2.5 text-xs text-bad'>
          <IconBraces size={15} className='mt-0.5 shrink-0' />
          <div className='min-w-0'>
            <p className='font-bold'>JSON không hợp lệ</p>
            <p className='mt-0.5 wrap-break-word text-[11px]'>{parseErr}. Kiểm tra dấu ngoặc, dấu phẩy và chuỗi ký tự.</p>
          </div>
        </div>
      )}
      <div className={EDITOR_HEIGHT_CLASS}>
        <Editor
          value={text}
          onChange={(value) => setText(value ?? '')}
          language='json'
          theme='vs-dark'
          options={MONACO_OPTIONS}
          onMount={bindCtrlS}
          loading={<div className='grid size-full place-items-center bg-bg text-xs text-mute'>Đang khởi tạo editor…</div>}
        />
      </div>
    </div>
  );
};