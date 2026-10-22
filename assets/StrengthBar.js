import { r as passwordStrength } from "./validate.js";
import { mt as require_jsx_runtime } from "./index.js";
// src/shared/components/StrengthBar.jsx
var import_jsx_runtime = require_jsx_runtime();
var LABELS = [
	"Rất yếu",
	"Yếu",
	"Trung bình",
	"Mạnh",
	"Rất mạnh"
];
var colorFor = (n) => n < 2 ? "bg-bad" : n < 3 ? "bg-coin" : "bg-ok";
function StrengthBar({ value }) {
	const n = passwordStrength(value);
	if (!value) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "-mt-2 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-1 gap-1",
			children: [
				0,
				1,
				2,
				3
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1 flex-1 rounded-full ${i < n ? colorFor(n) : "bg-raise"}` }, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-20 text-right text-[10px] text-mute",
			children: LABELS[n]
		})]
	});
}
export { StrengthBar as t };
