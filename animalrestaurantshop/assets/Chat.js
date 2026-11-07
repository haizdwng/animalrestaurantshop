import { Et as require_jsx_runtime, f as getChat, ft as ErrorState, p as sendChat, pt as Spinner } from "./index.js";
import { n as MessageList, r as Composer, t as usePolling } from "./usePolling.js";
// src/features/chat/Chat.jsx
var import_jsx_runtime = require_jsx_runtime();
function Chat() {
	const { data, error, loading, refresh, setData } = usePolling(getChat);
	const messages = data?.messages || [];
	const send = async (text) => {
		const r = await sendChat(text);
		setData((current) => ({
			...current,
			messages: [...current?.messages || [], r.chat]
		}));
		refresh();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-screen space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-extrabold tracking-tight",
			children: "Trò chuyện"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-mute",
			children: "Nhắn tin trực tiếp với quản trị viên để được hỗ trợ"
		})] }), !data && loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-64 place-items-center rounded-2xl border border-line bg-panel",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 20 })
		}) : !data && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			message: error,
			onRetry: refresh,
			loading
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex h-[calc(100dvh-var(--app-header-h)-var(--app-bottom-nav-h)-9.5rem)] min-h-80 flex-col overflow-hidden rounded-2xl border border-line bg-panel md:h-[calc(100dvh-var(--app-header-h)-9.5rem)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageList, {
				messages,
				mineSender: "user",
				empty: "Chưa có tin nhắn nào — hãy gửi lời chào đến quản trị viên!"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
				onSend: send,
				disabled: data?.banned,
				disabledText: "Bạn đã bị cấm trò chuyện"
			})]
		})]
	});
}
export { Chat as default };
