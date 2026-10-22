import { Ct as __toESM, St as require_react, mt as require_jsx_runtime, nt as Pager, xt as createReactComponent } from "./index.js";
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconGift = createReactComponent("outline", "gift", "Gift", [
	["path", {
		"d": "M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -2",
		"key": "svg-0"
	}],
	["path", {
		"d": "M12 8l0 13",
		"key": "svg-1"
	}],
	["path", {
		"d": "M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7",
		"key": "svg-2"
	}],
	["path", {
		"d": "M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5",
		"key": "svg-3"
	}]
]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconPencil = createReactComponent("outline", "pencil", "Pencil", [["path", {
	"d": "M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4",
	"key": "svg-0"
}], ["path", {
	"d": "M13.5 6.5l4 4",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconUpload = createReactComponent("outline", "upload", "Upload", [
	["path", {
		"d": "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
		"key": "svg-0"
	}],
	["path", {
		"d": "M7 9l5 -5l5 5",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 4l0 12",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconUserPlus = createReactComponent("outline", "user-plus", "UserPlus", [
	["path", {
		"d": "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M16 19h6",
		"key": "svg-1"
	}],
	["path", {
		"d": "M19 16v6",
		"key": "svg-2"
	}],
	["path", {
		"d": "M6 21v-2a4 4 0 0 1 4 -4h4",
		"key": "svg-3"
	}]
]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconStarFilled = createReactComponent("filled", "star-filled", "StarFilled", [["path", {
	"d": "M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z",
	"key": "svg-0"
}]]);
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
// src/shared/hooks/useRemoteResource.js
function useRemoteResource(fetcher) {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const mounted = (0, import_react.useRef)(false);
	const request = (0, import_react.useRef)(0);
	const fetcherRef = (0, import_react.useRef)(fetcher);
	fetcherRef.current = fetcher;
	const reload = (0, import_react.useCallback)(async () => {
		const id = ++request.current;
		setLoading(true);
		setError("");
		try {
			const next = await fetcherRef.current();
			if (mounted.current && id === request.current) setData(next);
			return next;
		} catch (e) {
			if (mounted.current && id === request.current) setError(e?.message || "Không tải được dữ liệu");
			return null;
		} finally {
			if (mounted.current && id === request.current) setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		mounted.current = true;
		reload();
		return () => {
			mounted.current = false;
			request.current += 1;
		};
	}, [reload]);
	return {
		data,
		setData,
		loading,
		error,
		reload
	};
}
export { IconUpload as a, IconUserPlus as i, usePaginatedData as n, IconPencil as o, IconStarFilled as r, IconGift as s, useRemoteResource as t };
