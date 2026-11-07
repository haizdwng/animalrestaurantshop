import { t as IconTrash } from "./IconTrash.js";
import { Ct as toastError, Et as require_jsx_runtime, Ht as __toESM, Ot as IconSend, St as toast, Tt as Button, Vt as require_react, a as formatShortDateTime } from "./index.js";
// src/features/chat/config.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var CHAT_POLL_INTERVAL = 4e3;
// src/features/chat/Composer.jsx
var import_jsx_runtime = require_jsx_runtime();
function Composer({ onSend, disabled, disabledText, placeholder = "Nhập tin nhắn…" }) {
	const [text, setText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const trimmed = text.trim();
	const submit = async (e) => {
		e?.preventDefault();
		if (busy || disabled) return;
		if (!trimmed) return;
		if (trimmed.length > 500) return toast(`Tin nhắn không được vượt quá 500 ký tự`, "err");
		setBusy(true);
		try {
			await onSend(trimmed);
			setText("");
		} catch (error) {
			toastError(error);
		} finally {
			setBusy(false);
		}
	};
	if (disabled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "border-t border-line px-4 py-3 text-center text-xs text-bad",
		children: disabledText
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "flex items-end gap-2 border-t border-line p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: text,
				onChange: (e) => setText(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
				},
				rows: 1,
				maxLength: 550,
				placeholder,
				className: "max-h-28 min-h-10 w-full resize-none rounded-lg border border-line bg-panel px-3 py-2 text-base outline-none placeholder:text-mute/50 focus:border-lime sm:text-sm"
			}), text.length > 400 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: `mt-1 text-right text-[10px] ${text.length > 500 ? "text-bad" : "text-mute"}`,
				children: [
					text.length,
					"/",
					500
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "submit",
			className: "size-10! shrink-0 p-0!",
			loading: busy,
			disabled: !trimmed,
			"aria-label": "Gửi",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSend, { size: 16 })
		})]
	});
}
// src/features/chat/MessageList.jsx
function Bubble({ message, mine, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: `flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: message.avatar,
			alt: "",
			loading: "lazy",
			className: "size-8 shrink-0 rounded-full bg-raise object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `group flex min-w-0 max-w-[80%] flex-col ${mine ? "items-end" : "items-start"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-0.5 flex items-center gap-1.5 px-1 text-[10px] text-mute",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `max-w-40 truncate font-bold ${message.sender === "admin" ? "text-lime" : ""}`,
					children: message.sender === "admin" ? `${message.name} · Quản trị viên` : message.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatShortDateTime(message.createdAt) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					mine && onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteButton, { onClick: () => onDelete(message) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `rounded-2xl px-3 py-2 text-sm leading-snug wrap-break-word whitespace-pre-wrap ${mine ? "rounded-br-md bg-lime text-bg" : "rounded-bl-md bg-raise"}`,
						children: message.text
					}),
					!mine && onDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteButton, { onClick: () => onDelete(message) })
				]
			})]
		})]
	});
}
function DeleteButton({ onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		"aria-label": "Xoá tin nhắn",
		className: "grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg text-mute opacity-60 transition hover:bg-raise hover:text-bad hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTrash, { size: 14 })
	});
}
function MessageList({ messages, mineSender, onDelete, empty }) {
	const box = (0, import_react.useRef)(null);
	const stick = (0, import_react.useRef)(true);
	const lastId = messages[messages.length - 1]?._id;
	(0, import_react.useEffect)(() => {
		const el = box.current;
		if (!el) return;
		const onScroll = () => stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => el.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		const el = box.current;
		if (el && stick.current) el.scrollTop = el.scrollHeight;
	}, [lastId, messages.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: box,
		className: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4",
		children: messages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubble, {
				message: m,
				mine: m.sender === mineSender,
				onDelete
			}, m._id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "grid h-full min-h-40 place-items-center text-center text-xs text-mute",
			children: empty
		})
	});
}
// src/features/chat/usePolling.js
function usePolling(fetcher, deps = [], interval = CHAT_POLL_INTERVAL) {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetcherRef = (0, import_react.useRef)(fetcher);
	fetcherRef.current = fetcher;
	const alive = (0, import_react.useRef)(true);
	const inflight = (0, import_react.useRef)(false);
	const generation = (0, import_react.useRef)(0);
	const refresh = (0, import_react.useCallback)(async () => {
		if (inflight.current) return;
		inflight.current = true;
		const current = generation.current;
		try {
			const next = await fetcherRef.current();
			if (alive.current && current === generation.current) {
				setData(next);
				setError("");
			}
		} catch (e) {
			if (alive.current && current === generation.current) setError(e?.message || "Không tải được dữ liệu");
		} finally {
			inflight.current = false;
			if (alive.current && current === generation.current) setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		alive.current = true;
		generation.current += 1;
		inflight.current = false;
		setData(null);
		setLoading(true);
		refresh();
		let timer;
		const start = () => {
			clearInterval(timer);
			timer = setInterval(() => !document.hidden && refresh(), interval);
		};
		const onVisible = () => !document.hidden && refresh();
		start();
		document.addEventListener("visibilitychange", onVisible);
		return () => {
			alive.current = false;
			clearInterval(timer);
			document.removeEventListener("visibilitychange", onVisible);
		};
	}, [
		refresh,
		interval,
		...deps
	]);
	return {
		data,
		setData,
		error,
		loading,
		refresh
	};
}
export { MessageList as n, Composer as r, usePolling as t };
