import { At as useParams, Mt as require_react, Nt as __toESM, O as adminSaveData, ct as Tabs, et as JsonEditor, kt as useNavigate, m as adminData, yt as require_jsx_runtime } from "./index.js";
import { r as DATA_TABS } from "./config.js";
import { t as Head } from "./Head.js";
// src/features/administration/Data.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_DATA_SECTION = "musicians";
function AdminData() {
	const { section } = useParams();
	const navigate = useNavigate();
	const activeSection = DATA_TABS.some(([key]) => key === section) ? section : DEFAULT_DATA_SECTION;
	(0, import_react.useEffect)(() => {
		if (!section || activeSection !== section) navigate(`/administrator/data/${DEFAULT_DATA_SECTION}`, { replace: true });
	}, [
		section,
		activeSection,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
			title: "Dữ liệu",
			sub: "Chỉnh sửa cấu hình · Ctrl/⌘ + S để lưu",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				tabs: DATA_TABS,
				value: activeSection,
				onChange: (next) => navigate(`/administrator/data/${next}`)
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonEditor, {
			deps: [activeSection],
			load: async () => (await adminData(activeSection))[activeSection],
			save: (value) => adminSaveData(activeSection, value)
		}, activeSection)]
	});
}
export { AdminData as default };
