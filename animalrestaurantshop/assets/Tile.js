import { C as productOptions, _ as hasValidPrice, ln as require_react, rn as require_jsx_runtime, tn as createReactComponent, un as __toESM } from "./index.js";
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconStar = /* @__PURE__ */ createReactComponent("outline", "star", "Star", [["path", {
	"d": "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245",
	"key": "svg-0"
}]]);
// src/features/shop/shopUtilities.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var hasPrice = hasValidPrice;
var initials = (name) => String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
var matches = (product, needle) => !needle || String(product.name || "").toLowerCase().includes(needle) || String(product.key || "").toLowerCase().includes(needle) || productOptions(product).some((option) => String(option.key || "").toLowerCase().includes(needle) || String(option.name || "").toLowerCase().includes(needle));
// src/features/shop/Tile.jsx
var import_jsx_runtime = require_jsx_runtime();
var usableImage = (value) => typeof value === "string" && /^(https?:\/\/|\/|data:image\/)/i.test(value);
function Tile({ p, size = "md" }) {
	const large = size === "lg";
	const [failed, setFailed] = (0, import_react.useState)("");
	const src = usableImage(p?.image) ? p.image : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-raise text-mute ${large ? "size-16" : "size-12"}`,
		children: src && src !== failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			loading: "lazy",
			className: "size-full object-cover",
			onError: () => setFailed(src)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-extrabold tracking-tight ${large ? "text-xl" : "text-sm"}`,
			children: initials(p?.name || p?.key) || "?"
		})
	});
}
export { IconStar as i, hasPrice as n, matches as r, Tile as t };
