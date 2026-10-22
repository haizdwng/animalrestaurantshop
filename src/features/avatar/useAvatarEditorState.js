import { useEffect, useMemo, useReducer } from 'react';
import { DRAFT_KEY } from '@/features/avatar/config';
import { INITIAL_DOC, initialState, reducer, sanitizeDoc } from '@/features/avatar/avatarEditorState';

function loadDraft() {
  try {
    return sanitizeDoc(JSON.parse(localStorage.getItem(DRAFT_KEY)));
  } catch {
    return INITIAL_DOC;
  };
};

export default function useAvatarEditor() {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState(loadDraft()));

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(state.doc));
      } catch {
      };
    }, 400);
    return () => clearTimeout(t);
  }, [state.doc]);

  const selected = useMemo(() => state.doc.items.find((i) => i.id === state.selectedId) || null, [state.doc, state.selectedId]);

  return { doc: state.doc, selected, selectedId: state.selectedId, canUndo: state.past.length > 0, canRedo: state.future.length > 0, dispatch };
};