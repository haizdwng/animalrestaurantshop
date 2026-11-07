import { B as getTransaction, Ct as toastError, Dt as IconX, Et as require_jsx_runtime, Ht as __toESM, It as createReactComponent, Nt as IconCircleCheck, R as cancelTransaction, St as toast, Tt as Button, Vt as require_react, at as Coin, bt as Dialog, i as formatNumber, kt as IconRefresh, o as formatVietnameseDong, pt as Spinner } from "./index.js";
import { t as IconCopy } from "./IconCopy.js";
import { t as copyText } from "./clipboard.js";
import { t as IconBan } from "./IconBan.js";
/**
* @license @tabler/icons-react v3.50.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconClock = createReactComponent("outline", "clock", "Clock", [["path", {
	"d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
	"key": "svg-0"
}], ["path", {
	"d": "M12 7v5l3 3",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.50.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconHourglassEmpty = createReactComponent("outline", "hourglass-empty", "HourglassEmpty", [["path", {
	"d": "M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1",
	"key": "svg-0"
}], ["path", {
	"d": "M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.50.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconQrcode = createReactComponent("outline", "qrcode", "Qrcode", [
	["path", {
		"d": "M4 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4",
		"key": "svg-0"
	}],
	["path", {
		"d": "M7 17l0 .01",
		"key": "svg-1"
	}],
	["path", {
		"d": "M14 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4",
		"key": "svg-2"
	}],
	["path", {
		"d": "M7 7l0 .01",
		"key": "svg-3"
	}],
	["path", {
		"d": "M4 15a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -4",
		"key": "svg-4"
	}],
	["path", {
		"d": "M17 7l0 .01",
		"key": "svg-5"
	}],
	["path", {
		"d": "M14 14l3 0",
		"key": "svg-6"
	}],
	["path", {
		"d": "M20 14l0 .01",
		"key": "svg-7"
	}],
	["path", {
		"d": "M14 14l0 3",
		"key": "svg-8"
	}],
	["path", {
		"d": "M14 20l3 0",
		"key": "svg-9"
	}],
	["path", {
		"d": "M17 17l3 0",
		"key": "svg-10"
	}],
	["path", {
		"d": "M20 17l0 3",
		"key": "svg-11"
	}]
]);
// src/shared/components/payment/StatusBadge.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	pending: {
		label: "Chờ thanh toán",
		cls: "bg-coin/15 text-coin",
		Icon: IconClock
	},
	success: {
		label: "Thành công",
		cls: "bg-ok/15 text-ok",
		Icon: IconCircleCheck
	},
	cancelled: {
		label: "Đã huỷ",
		cls: "bg-raise text-mute",
		Icon: IconBan
	},
	expired: {
		label: "Hết hạn",
		cls: "bg-raise text-mute",
		Icon: IconHourglassEmpty
	}
};
function StatusBadge({ status }) {
	const s = STATUS[status] || STATUS.pending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${s.cls}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.Icon, { size: 11 }),
			" ",
			s.label
		]
	});
}
// src/shared/components/payment/PaymentDialog.jsx
var POLL = 6e3;
var DIALOG_TTL_MS = 3e5;
var PAID_MSG = "Thanh toán thành công (đã cộng xu)";
var merge = (tx, r) => ({
	...tx,
	...r.transaction,
	coin: tx.coin,
	status: r.status
});
function remainingMs(expiredAt) {
	if (!expiredAt) return null;
	return Math.max(0, new Date(expiredAt).getTime() - Date.now());
}
function formatCountdown(ms) {
	if (ms == null || ms < 0) return null;
	const s = Math.ceil(ms / 1e3);
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${m}:${String(r).padStart(2, "0")}`;
}
function usePaymentPolling(tx, status, live, setAuto) {
	(0, import_react.useEffect)(() => {
		if (!tx?.code || status !== "pending") return;
		let stop = false;
		let timer;
		const tick = async () => {
			setAuto(true);
			try {
				const r = await getTransaction(tx.code);
				if (stop) return;
				if (r.status !== "pending") {
					const { tx: cur, onChange, onPaid, onClose } = live.current;
					onChange?.(merge(cur, r));
					if (r.status === "success") {
						toast(r.message || PAID_MSG);
						onPaid?.();
					} else if (r.status === "expired") toast(r.message || "Giao dịch đã hết hạn", "info");
					onClose?.();
					return;
				}
			} catch {} finally {
				if (!stop) setAuto(false);
			}
			if (!stop) timer = setTimeout(tick, POLL);
		};
		timer = setTimeout(tick, POLL);
		return () => {
			stop = true;
			clearTimeout(timer);
		};
	}, [tx?.code, status]);
}
function useDialogCountdown(tx, status, onExpire) {
	const [left, setLeft] = (0, import_react.useState)(() => {
		if (status !== "pending") return null;
		if (tx?.expiredAt) return remainingMs(tx.expiredAt);
		return DIALOG_TTL_MS;
	});
	const onExpireRef = (0, import_react.useRef)(onExpire);
	onExpireRef.current = onExpire;
	const started = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (status !== "pending" || !tx?.code) {
			setLeft(null);
			return;
		}
		if (tx.expiredAt) setLeft(remainingMs(tx.expiredAt));
		else {
			if (!started.current || started.current.code !== tx.code) started.current = {
				code: tx.code,
				at: Date.now()
			};
			setLeft(Math.max(0, DIALOG_TTL_MS - (Date.now() - started.current.at)));
		}
	}, [
		tx?.code,
		tx?.expiredAt,
		status
	]);
	(0, import_react.useEffect)(() => {
		if (status !== "pending" || left == null) return;
		if (left <= 0) {
			onExpireRef.current?.();
			return;
		}
		const id = setTimeout(() => {
			if (tx?.expiredAt) setLeft(remainingMs(tx.expiredAt));
			else if (started.current?.code === tx?.code) setLeft(Math.max(0, DIALOG_TTL_MS - (Date.now() - started.current.at)));
		}, 250);
		return () => clearTimeout(id);
	}, [
		left,
		status,
		tx?.code,
		tx?.expiredAt
	]);
	return left;
}
function Amount({ tx }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] text-mute",
		children: tx.coin ? "Mua" : "Số tiền"
	}), tx.coin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-0.5 flex items-center gap-2 text-2xl font-extrabold tabular-nums text-coin",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 22 }),
			" ",
			formatNumber(tx.coin)
		]
	}), tx.amount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-0.5 text-xs tabular-nums text-mute",
		children: formatVietnameseDong(tx.amount)
	}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-0.5 text-2xl font-extrabold tabular-nums",
		children: formatVietnameseDong(tx.amount)
	})] });
}
function QrCode({ tx, status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto aspect-square w-full max-w-[min(100%,40dvh,320px)] rounded-2xl bg-white p-3",
		children: [tx.qr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: tx.qr,
			alt: `Mã QR giao dịch ${tx.code}`,
			className: `size-full object-contain ${status !== "pending" ? "opacity-10 grayscale" : ""}`
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconQrcode, { className: "size-full text-black/10" }), status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `rounded-full px-4 py-2 text-xs font-extrabold ${STATUS[status]?.cls}`,
				children: STATUS[status]?.label
			})
		})]
	});
}
function PaymentDialog({ tx, onClose, onChange, onPaid }) {
	const [busy, setBusy] = (0, import_react.useState)("");
	const [confirmCancel, setConfirmCancel] = (0, import_react.useState)(false);
	const [auto, setAuto] = (0, import_react.useState)(false);
	const status = tx?.status || "pending";
	const live = (0, import_react.useRef)({});
	live.current = {
		tx,
		onChange,
		onPaid,
		onClose
	};
	usePaymentPolling(tx, status, live, setAuto);
	const handleExpire = () => {
		if (!tx) return;
		onChange?.({
			...tx,
			status: "expired"
		});
		toast("Giao dịch đã hết hạn", "info");
		onClose?.();
	};
	const left = useDialogCountdown(tx, status, handleExpire);
	(0, import_react.useEffect)(() => setConfirmCancel(false), [tx?.code]);
	if (!tx) return null;
	const run = async (kind, fn) => {
		setBusy(kind);
		try {
			await fn();
		} catch (e) {
			toastError(e);
		} finally {
			setBusy("");
		}
	};
	const check = () => run("check", async () => {
		const r = await getTransaction(tx.code);
		const next = r.status;
		onChange?.(merge(tx, r));
		if (next === "success") {
			toast(r.message || PAID_MSG);
			onPaid?.();
			onClose?.();
		} else if (next === "expired") {
			toast(r.message || "Giao dịch đã hết hạn", "info");
			onClose?.();
		} else {
			toast(r.message || (next === "pending" ? "Chưa nhận được thanh toán" : STATUS[next]?.label), next === "pending" ? "info" : "ok");
			if (next !== "pending") onClose?.();
		}
	});
	const cancel = () => run("cancel", async () => {
		const r = await cancelTransaction(tx.code);
		onChange?.({
			...tx,
			status: "cancelled"
		});
		setConfirmCancel(false);
		toast(r.message || "Đã huỷ giao dịch", "info");
		onClose?.();
	});
	const countdownLabel = status === "pending" ? formatCountdown(left) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open: true,
		title: "Thanh toán mua xu",
		onClose: () => !busy && onClose(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Amount, { tx }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status }), countdownLabel != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: `text-[11px] font-bold tabular-nums ${left != null && left <= 6e4 ? "text-bad" : "text-mute"}`,
						children: ["Còn ", countdownLabel]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
				tx,
				status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => copyText(tx.code, "Đã sao chép mã giao dịch"),
				className: "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-dashed border-line bg-bg px-3 py-2.5 text-left hover:border-mute",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[10px] text-mute",
						children: "Mã giao dịch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-sm font-bold",
						children: tx.code
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCopy, {
					size: 16,
					className: "shrink-0 text-mute"
				})]
			}),
			status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-start gap-2 text-[11px] leading-relaxed text-mute",
				children: [
					auto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, {
						size: 12,
						className: "mt-0.5 shrink-0 text-lime"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1.5 shrink-0 animate-pulse rounded-full bg-ok" }),
					"Quét mã bằng app ngân hàng, giữ nguyên nội dung chuyển khoản. Trang web sẽ tự kiểm tra định kỳ (hoặc bấm “Kiểm tra”).",
					countdownLabel != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" Hết hạn sau ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: "text-fg",
						children: countdownLabel
					})] })
				]
			}),
			status === "pending" && (confirmCancel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-rise space-y-3 rounded-xl border border-bad/40 bg-bad/10 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs",
					children: "Huỷ giao dịch này? Mã QR sẽ không dùng được nữa."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: !!busy,
						onClick: () => setConfirmCancel(false),
						children: "Không"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						loading: busy === "cancel",
						onClick: cancel,
						children: "Huỷ giao dịch"
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[auto_1fr] gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					disabled: !!busy,
					onClick: () => setConfirmCancel(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconX, { size: 14 }), " Huỷ"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					loading: busy === "check",
					onClick: check,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 16 }), " Kiểm tra"]
				})]
			})),
			status !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "w-full",
				onClick: onClose,
				children: "Đóng"
			})
		]
	});
}
export { IconQrcode as i, STATUS as n, StatusBadge as r, PaymentDialog as t };
