import { useEffect, useState } from 'react';
import Pager from '@/shared/components/ui/Pager';

export default function usePaginatedData(list, size, resetKey) {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [resetKey, size]);
  const pageSize = Math.max(1, Number(size) || 1);
  const total = list?.length || 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pg = Math.min(page, pages);
  const rows = list?.slice((pg - 1) * pageSize, pg * pageSize);
  const pager = total > 0 && <Pager page={pg} pages={pages} size={pageSize} total={total} onPage={setPage} />;
  return { rows, pager };
};