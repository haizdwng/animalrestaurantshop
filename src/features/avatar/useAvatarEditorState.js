import { useEffect, useMemo, useReducer, useRef } from 'react';
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
  const latestDoc = useRef(state.doc);
  latestDoc.current = state.doc;

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(state.doc));
      } catch {};
    }, 400);
    return () => clearTimeout(timeout);
  }, [state.doc]);

  useEffect(() => () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(latestDoc.current));
    } catch {};
  }, []);

  const selected = useMemo(() => state.doc.items.find((item) => item.id === state.selectedId) || null, [state.doc, state.selectedId]);

  return { doc: state.doc, selected, selectedId: state.selectedId, canUndo: state.past.length > 0, canRedo: state.future.length > 0, dispatch };
};