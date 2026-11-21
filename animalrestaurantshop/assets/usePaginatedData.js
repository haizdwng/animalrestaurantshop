import { Ft as Pager, cn as require_react, ln as __toESM, nn as require_jsx_runtime } from "./index.js";
// src/shared/hooks/usePaginatedData.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function usePaginatedData(list, resetKey) {
	const [page, setPage] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => setPage(1), [resetKey]);
	const total = list?.length || 0;
	const pages = Math.max(1, Math.ceil(total / 10));
	const currentPage = Math.min(page, pages);
	return {
		rows: list?.slice((currentPage - 1) * 10, currentPage * 10),
		pager: total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
			page: currentPage,
			pages,
			size: 10,
			total,
			onPage: setPage
		})
	};
}
export { usePaginatedData as t };
