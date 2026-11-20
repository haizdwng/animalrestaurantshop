import { Ft as Pager, ln as require_react, rn as require_jsx_runtime, un as __toESM } from "./index.js";
// src/shared/hooks/usePaginatedData.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function usePaginatedData(list, size, resetKey) {
	const [page, setPage] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => setPage(1), [resetKey, size]);
	const pageSize = Math.max(1, Number(size) || 1);
	const total = list?.length || 0;
	const pages = Math.max(1, Math.ceil(total / pageSize));
	const pg = Math.min(page, pages);
	return {
		rows: list?.slice((pg - 1) * pageSize, pg * pageSize),
		pager: total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
			page: pg,
			pages,
			size: pageSize,
			total,
			onPage: setPage
		})
	};
}
export { usePaginatedData as t };
