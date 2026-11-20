import { B as adminData, It as Tabs, Ot as JsonEditor, et as adminSaveData, ln as require_react, on as useNavigate, rn as require_jsx_runtime, sn as useParams, un as __toESM } from "./index.js";
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
		className: "min-w-0 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
				title: "Dữ liệu",
				sub: "Chỉnh sửa cấu hình · Ctrl/⌘ + S để lưu"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				tabs: DATA_TABS,
				value: activeSection,
				label: "Danh mục dữ liệu",
				onChange: (next) => navigate(`/administrator/data/${next}`)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonEditor, {
				deps: [activeSection],
				load: async () => (await adminData(activeSection))[activeSection],
				save: (value) => adminSaveData(activeSection, value)
			}, activeSection)
		]
	});
}
export { AdminData as default };
