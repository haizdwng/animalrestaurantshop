import { ln as require_react, tn as createReactComponent, un as __toESM } from "./index.js";
/**
* @license @tabler/icons-react v3.52.0 - MIT
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
// src/shared/hooks/useRemoteResource.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useRemoteResource(fetcher, enabled = true) {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const mounted = (0, import_react.useRef)(false);
	const request = (0, import_react.useRef)(0);
	const fetcherRef = (0, import_react.useRef)(fetcher);
	fetcherRef.current = fetcher;
	const reload = (0, import_react.useCallback)(async () => {
		const requestId = ++request.current;
		setLoading(true);
		setError("");
		try {
			const next = await fetcherRef.current();
			if (mounted.current && requestId === request.current) setData(next);
			return next;
		} catch (fetchError) {
			if (mounted.current && requestId === request.current) setError(fetchError?.message || "Không tải được dữ liệu");
			return null;
		} finally {
			if (mounted.current && requestId === request.current) setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		mounted.current = true;
		if (enabled) reload();
		else {
			request.current += 1;
			setData(null);
			setLoading(false);
			setError("");
		}
		return () => {
			mounted.current = false;
			request.current += 1;
		};
	}, [reload, enabled]);
	return {
		data,
		setData,
		loading,
		error,
		reload
	};
}
export { IconPencil as n, useRemoteResource as t };
