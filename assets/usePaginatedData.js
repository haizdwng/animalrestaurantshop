import { At as require_jsx_runtime, It as require_react, Lt as __toESM, Ot as createReactComponent, lt as Pager } from "./index.js";
/**
* @license @tabler/icons-react v3.53.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconPencil = /* @__PURE__ */ createReactComponent("outline", "pencil", "Pencil", [["path", {
	"d": "M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4",
	"key": "svg-0"
}], ["path", {
	"d": "M13.5 6.5l4 4",
	"key": "svg-1"
}]]);
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
export { IconPencil as n, usePaginatedData as t };
