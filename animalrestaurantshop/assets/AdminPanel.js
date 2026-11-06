import { Dt as useLocation, Et as Outlet, Ot as useNavigate, _t as require_jsx_runtime, ot as Tabs } from "./index.js";
import { t as ADMIN_TABS } from "./config.js";
// src/features/administration/AdminPanel.jsx
var import_jsx_runtime = require_jsx_runtime();
function AdminPanel() {
	const location = useLocation();
	const navigate = useNavigate();
	const requestedTab = location.pathname.replace(/^\/administrator\/?/, "").split("/")[0] || "giftcodes";
	const tab = ADMIN_TABS.some(([key]) => key === requestedTab) ? requestedTab : "giftcodes";
	const visit = (next) => navigate(`/administrator/${next}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-screen space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			tabs: ADMIN_TABS,
			value: tab,
			onChange: visit
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
	});
}
export { AdminPanel as default };
