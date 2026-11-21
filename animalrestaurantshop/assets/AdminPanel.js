import { It as Tabs, an as useNavigate, in as useLocation, nn as require_jsx_runtime, rn as Outlet } from "./index.js";
import { t as ADMIN_TABS } from "./config.js";
// src/features/administration/AdminPanel.jsx
var import_jsx_runtime = require_jsx_runtime();
function AdminPanel() {
	const location = useLocation();
	const navigate = useNavigate();
	const requestedTab = location.pathname.replace(/^\/administrator\/?/, "").split("/")[0] || "giftcodes";
	const activeTab = ADMIN_TABS.some(([key]) => key === requestedTab) ? requestedTab : "giftcodes";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-screen space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			tabs: ADMIN_TABS,
			value: activeTab,
			label: "Quản trị viên",
			onChange: (next) => navigate(`/administrator/${next}`)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
	});
}
export { AdminPanel as default };
