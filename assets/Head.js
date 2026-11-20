import { Kt as Button, ln as require_react, rn as require_jsx_runtime, un as __toESM } from "./index.js";
// src/features/administration/Head.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function renderIconActions(element) {
	if (!(0, import_react.isValidElement)(element)) return element;
	if (element.type === Button) {
		const nodes = import_react.Children.toArray(element.props.children);
		const icon = nodes.find(import_react.isValidElement);
		if (!icon) return element;
		const label = element.props["aria-label"] || nodes.filter((node) => typeof node === "string").join(" ").trim();
		if (!label) return element;
		return (0, import_react.cloneElement)(element, {
			"aria-label": label,
			title: label,
			className: "size-9! shrink-0 p-0!",
			children: icon
		});
	}
	if (element.props.children === void 0) return element;
	return (0, import_react.cloneElement)(element, void 0, import_react.Children.map(element.props.children, renderIconActions));
}
function Head({ title, sub, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex min-w-0 items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1 space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "ui-heading",
				children: title
			}), sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "ui-description",
				children: sub
			})]
		}), children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 items-center gap-2",
			children: renderIconActions(children)
		})]
	});
}
export { Head as t };
