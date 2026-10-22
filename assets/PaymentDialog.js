import { i as IconCopy, t as copyText } from "./clipboard.js";
import { Ct as __toESM, D as cancelTransaction, St as require_react, ct as Dialog, dt as toastError, gt as IconRefresh, ht as IconX, i as formatNumber, k as getTransaction, mt as require_jsx_runtime, o as formatVietnameseDong, pt as Button, q as Coin, tt as Spinner, ut as toast, vt as IconCircleCheck, xt as createReactComponent } from "./index.js";
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconBan = createReactComponent("outline", "ban", "Ban", [["path", {
	"d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
	"key": "svg-0"
}], ["path", {
	"d": "M5.7 5.7l12.6 12.6",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconClockHour4 = createReactComponent("outline", "clock-hour-4", "ClockHour4", [
	["path", {
		"d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M12 12l3 2",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 7v5",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
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
		Icon: IconClockHour4
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
var PAID_MSG = "Thanh toán thành công (đã cộng xu)";
var merge = (tx, r) => ({
	...tx,
	...r.transaction,
	coin: tx.coin,
	status: r.status
});
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
					const { tx: cur, onChange, onPaid } = live.current;
					onChange?.(merge(cur, r));
					if (r.status === "success") {
						toast(r.message || PAID_MSG);
						onPaid?.();
					}
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
		onPaid
	};
	usePaymentPolling(tx, status, live, setAuto);
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
		} else toast(r.message || (next === "pending" ? "Chưa nhận được thanh toán" : STATUS[next]?.label), next === "pending" ? "info" : "ok");
	});
	const cancel = () => run("cancel", async () => {
		const r = await cancelTransaction(tx.code);
		onChange?.({
			...tx,
			status: "cancelled"
		});
		setConfirmCancel(false);
		toast(r.message || "Đã huỷ giao dịch", "info");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open: true,
		title: "Thanh toán mua xu",
		onClose: () => !busy && onClose(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Amount, { tx }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status })]
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
				children: [auto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, {
					size: 12,
					className: "mt-0.5 shrink-0 text-lime"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1.5 shrink-0 animate-pulse rounded-full bg-ok" }), "Quét mã bằng app ngân hàng, giữ nguyên nội dung chuyển khoản. App tự kiểm tra định kỳ (hoặc bấm “Kiểm tra”)."]
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
