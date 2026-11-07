import { Bt as useParams, Ct as toastError, Et as require_jsx_runtime, Ht as __toESM, Nt as IconCircleCheck, St as toast, Tt as Button, Vt as require_react, a as formatShortDateTime, bt as Dialog, c as adminChatThread, d as adminSendChat, ft as ErrorState, kt as IconRefresh, l as adminChats, pt as Spinner, s as adminBanChat, u as adminDeleteChat, zt as useNavigate } from "./index.js";
import { t as IconArrowLeft } from "./IconArrowLeft.js";
import { t as IconBan } from "./IconBan.js";
import { t as Head } from "./Head.js";
import { n as MessageList, r as Composer, t as usePolling } from "./usePolling.js";
// src/features/chat/AdminChat.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function ConversationList({ activeId, onOpen }) {
	const { data, error, loading, refresh } = usePolling(adminChats, [], 6e3);
	const list = data?.conversations;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
			title: "Trò chuyện",
			sub: list ? `${list.length.toLocaleString("vi-VN")} cuộc trò chuyện` : "Đang tải…",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "sm",
				className: "size-8! p-0!",
				onClick: refresh,
				disabled: loading,
				"aria-label": "Làm mới",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 14 })
			})
		}), !list && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			message: error,
			onRetry: refresh,
			loading
		}) : !list ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-40 place-items-center rounded-2xl border border-line bg-panel",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 20 })
		}) : list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-line rounded-2xl border border-line bg-panel",
			children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onOpen(c.userId),
				className: `flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition hover:bg-raise sm:px-5 ${c.userId === activeId ? "bg-raise" : ""}`,
				children: [
					c.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.avatar,
						alt: "",
						loading: "lazy",
						className: "size-10 shrink-0 rounded-full bg-raise object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 shrink-0 place-items-center rounded-full bg-raise text-sm font-extrabold text-lime uppercase",
						children: (c.username || "?")[0]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-sm font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate text-[11px] font-normal text-mute",
									children: ["@", c.username]
								}),
								c.banned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 rounded-full bg-bad/15 px-2 py-0.5 text-[10px] text-bad",
									children: "Bị cấm"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-0.5 block truncate text-[11px] text-mute",
							children: [c.lastSender === "admin" ? "Bạn: " : "", c.lastText]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[10px] text-mute",
						children: formatShortDateTime(c.lastAt)
					})
				]
			}) }, c.userId))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute",
			children: "Chưa có người dùng nào nhắn tin"
		})]
	});
}
function Thread({ userId, onBack }) {
	const { data, error, loading, refresh, setData } = usePolling(() => adminChatThread(userId), [userId]);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const user = data?.user;
	const messages = data?.messages || [];
	const send = async (text) => {
		const r = await adminSendChat(userId, text);
		setData((current) => ({
			...current,
			messages: [...current?.messages || [], r.chat]
		}));
		refresh();
	};
	const run = async (fn) => {
		setBusy(true);
		try {
			const r = await fn();
			toast(r.message);
			setConfirm(null);
			await refresh();
		} catch (e) {
			toastError(e);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "size-8! p-0!",
						onClick: onBack,
						"aria-label": "Quay lại",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconArrowLeft, { size: 14 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-base font-extrabold",
							children: user ? `@${user.username}` : "Trò chuyện"
						}), user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] text-mute",
							children: user.openid || "—"
						})]
					}),
					user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: user.banned ? "ghost" : "danger",
						size: "sm",
						onClick: () => setConfirm({ kind: "ban" }),
						children: [user.banned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCircleCheck, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBan, { size: 14 }), user.banned ? "Bỏ cấm chat" : "Cấm chat"]
					})
				]
			}),
			!data && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				message: error,
				onRetry: refresh,
				loading
			}) : !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-64 place-items-center rounded-2xl border border-line bg-panel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 20 })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex h-[calc(100dvh-var(--app-header-h)-var(--app-bottom-nav-h)-12rem)] min-h-80 flex-col overflow-hidden rounded-2xl border border-line bg-panel md:h-[calc(100dvh-var(--app-header-h)-12rem)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageList, {
					messages,
					mineSender: "admin",
					onDelete: (message) => setConfirm({
						kind: "delete",
						message
					}),
					empty: "Chưa có tin nhắn nào"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
					onSend: send,
					placeholder: "Trả lời người dùng…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: !!confirm,
				title: confirm?.kind === "delete" ? "Xoá tin nhắn" : user?.banned ? "Bỏ cấm trò chuyện" : "Cấm trò chuyện",
				onClose: () => !busy && setConfirm(null),
				children: [confirm?.kind === "delete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-mute",
					children: [
						"Tin nhắn “",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: confirm.message.text.slice(0, 120)
						}),
						"” sẽ bị xoá khỏi cuộc trò chuyện."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-mute",
					children: user?.banned ? `Cho phép @${user?.username} nhắn tin trở lại?` : `@${user?.username} sẽ không thể gửi tin nhắn nữa cho đến khi được bỏ cấm.`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setConfirm(null),
						disabled: busy,
						children: "Huỷ"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: confirm?.kind === "delete" || !user?.banned ? "danger" : "solid",
						loading: busy,
						onClick: () => run(() => confirm.kind === "delete" ? adminDeleteChat(userId, confirm.message._id) : adminBanChat(userId, !user.banned)),
						children: confirm?.kind === "delete" ? "Xoá" : user?.banned ? "Bỏ cấm" : "Cấm"
					})]
				})]
			})
		]
	});
}
function AdminChat() {
	const { userId } = useParams();
	const navigate = useNavigate();
	return userId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thread, {
		userId,
		onBack: () => navigate("/administrator/chat")
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationList, { onOpen: (id) => navigate(`/administrator/chat/${id}`) });
}
export { AdminChat as default };
