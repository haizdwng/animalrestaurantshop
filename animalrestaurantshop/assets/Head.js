import { Zt as require_jsx_runtime } from "./index.js";
// src/features/administration/Head.jsx
var import_jsx_runtime = require_jsx_runtime();
function Head({ title, sub, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "ui-heading",
				children: title
			}), sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "ui-description",
				children: sub
			})]
		}), children]
	});
}
export { Head as t };
