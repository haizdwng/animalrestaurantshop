import { useEffect, useState } from 'react';
import Pager from '@/shared/components/ui/Pager';
import { PAGE_SIZE } from '@/shared/configuration/pagination';

export default function usePaginatedData(list, resetKey) {
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [resetKey]);
  const total = list?.length || 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const rows = list?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pager = total > 0 && <Pager page={currentPage} pages={pages} size={PAGE_SIZE} total={total} onPage={setPage} />;
  return { rows, pager };
};