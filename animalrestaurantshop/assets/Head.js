import { Et as require_jsx_runtime } from "./index.js";
// src/features/administration/Head.jsx
var import_jsx_runtime = require_jsx_runtime();
function Head({ title, sub, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-extrabold tracking-tight",
			children: title
		}), sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-mute",
			children: sub
		})] }), children]
	});
}
export { Head as t };
