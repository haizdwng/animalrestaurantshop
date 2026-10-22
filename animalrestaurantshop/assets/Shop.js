import { i as IconQrcode, t as PaymentDialog } from "./PaymentDialog.js";
import { a as TOPUP, c as IconPlus, i as CATEGORY_ICONS, n as hasPrice, r as matches, t as Tile, u as IconBox } from "./Tile.js";
import { t as IconCheck } from "./IconCheck.js";
import { n as IconSearch, r as IconLock } from "./clipboard.js";
import { $ as Skeleton, Ct as __toESM, O as createTransaction, St as require_react, ct as Dialog, dt as toastError, et as ErrorState, ft as Field, gt as IconRefresh, ht as IconX, i as formatNumber, j as buy, mt as require_jsx_runtime, pt as Button, q as Coin, tt as Spinner, ut as toast, vt as IconCircleCheck, xt as createReactComponent } from "./index.js";
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconMinus = createReactComponent("outline", "minus", "Minus", [["path", {
	"d": "M5 12l14 0",
	"key": "svg-0"
}]]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconPackageOff = createReactComponent("outline", "package-off", "PackageOff", [
	["path", {
		"d": "M8.812 4.793l3.188 -1.793l8 4.5v8.5m-2.282 1.784l-5.718 3.216l-8 -4.5v-9l2.223 -1.25",
		"key": "svg-0"
	}],
	["path", {
		"d": "M14.543 10.57l5.457 -3.07",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 12v9",
		"key": "svg-2"
	}],
	["path", {
		"d": "M12 12l-8 -4.5",
		"key": "svg-3"
	}],
	["path", {
		"d": "M16 5.25l-4.35 2.447m-2.564 1.442l-1.086 .611",
		"key": "svg-4"
	}],
	["path", {
		"d": "M3 3l18 18",
		"key": "svg-5"
	}]
]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconPlayerPlay = createReactComponent("outline", "player-play", "PlayerPlay", [["path", {
	"d": "M7 4v16l13 -8l-13 -8",
	"key": "svg-0"
}]]);
// src/shared/components/payment/TopUp.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PRESETS = [
	20,
	50,
	100,
	200,
	500,
	1e3
];
var STEPS = [
	"Chọn số xu & tạo mã QR",
	"Quét mã bằng app ngân hàng",
	"Xu được cộng tự động"
];
function BalanceAside({ coins, adding }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex flex-col gap-5 rounded-2xl border border-coin/20 bg-[radial-gradient(120%_80%_at_100%_0%,color-mix(in_oklab,var(--color-coin)_14%,transparent),transparent)] p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-mute",
					children: "Số dư hiện tại"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 flex items-center gap-2 text-3xl font-extrabold tabular-nums text-coin",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 28 }),
						" ",
						formatNumber(coins)
					]
				}),
				adding > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-mute tabular-nums",
					children: ["Số dư sau khi nạp: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: "text-fg",
						children: formatNumber(coins + adding)
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-3 text-xs",
				children: STEPS.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-6 shrink-0 place-items-center rounded-full bg-raise text-[10px] font-bold text-coin",
							children: i + 1
						}),
						" ",
						t
					]
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-auto text-[10px] text-mute",
				children: "Giao dịch chưa thanh toán xem lại ở trang Tài khoản."
			})
		]
	});
}
function TopUp({ user, onPaid }) {
	const [coin, setCoin] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [tx, setTx] = (0, import_react.useState)(null);
	const n = parseInt(coin) || 0;
	const pick = (v) => {
		setCoin(v);
		setError("");
	};
	const submit = async (e) => {
		e.preventDefault();
		if (n < 20) return setError(`Tối thiểu 20 xu`);
		setBusy(true);
		try {
			const r = await createTransaction(n);
			setTx({
				code: r.code,
				qr: r.qr,
				coin: n,
				amount: r.amount,
				status: "pending"
			});
			toast(r.message || "Đã tạo giao dịch", "info");
		} catch (err) {
			toastError(err);
			setError(err.message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid animate-fade gap-4 lg:grid-cols-[minmax(0,1fr)_300px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				noValidate: true,
				className: "space-y-5 rounded-2xl border border-line bg-panel p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-extrabold tracking-tight sm:text-2xl",
						children: "Mua xu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-mute",
						children: [
							"Chọn số xu (tối thiểu ",
							20,
							" xu) và thanh toán bằng mã QR ngân hàng."
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2 sm:grid-cols-6",
						children: PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => pick(String(p)),
							className: `flex h-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border text-sm font-bold tabular-nums transition ${n === p ? "border-coin bg-coin/10 text-coin" : "border-line bg-bg hover:border-mute"}`,
							children: [formatNumber(p), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[9px] font-medium text-mute",
								children: "xu"
							})]
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Số xu",
						hint: `tối thiểu 20 xu`,
						inputMode: "numeric",
						placeholder: "số xu",
						value: coin,
						onChange: (e) => pick(e.target.value.replace(/\D/g, "").slice(0, 9)),
						error,
						className: "[&_input]:text-lg [&_input]:font-bold [&_input]:tabular-nums"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						loading: busy,
						disabled: n < 20,
						className: "h-12 w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconQrcode, { size: 17 }),
							" Tạo mã QR ",
							n >= 20 && `· ${formatNumber(n)} xu`
						]
					}),
					busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-[11px] text-mute",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, {
							size: 12,
							className: "text-lime"
						}), " Đang tạo giao dịch, có thể mất tới một phút…"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceAside, {
				coins: user.coins,
				adding: n
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
				tx,
				onClose: () => setTx(null),
				onChange: setTx,
				onPaid: () => {
					setCoin("");
					onPaid?.();
				}
			})
		]
	});
}
// src/features/shop/QuantityPicker.jsx
function QuantityPicker({ value, max, disabled, onChange, onEnter }) {
	const clamp = (n) => Math.min(max, Math.max(1, n));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-[11px] text-mute",
			children: "Số lượng"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-12 items-stretch overflow-hidden rounded-lg border border-line bg-bg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Giảm",
					disabled: value <= 1 || disabled,
					onClick: () => onChange(clamp(value - 1)),
					className: "w-12 cursor-pointer text-mute hover:bg-raise hover:text-fg disabled:cursor-not-allowed disabled:opacity-30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconMinus, {
						size: 18,
						className: "mx-auto"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					inputMode: "numeric",
					min: 1,
					max,
					"aria-label": "Số lượng",
					value,
					disabled,
					onChange: (e) => onChange(clamp(parseInt(e.target.value) || 1)),
					onKeyDown: (e) => e.key === "Enter" && onEnter(),
					className: "min-w-0 flex-1 bg-transparent text-center text-lg font-bold tabular-nums outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Tăng",
					disabled: value >= max || disabled,
					onClick: () => onChange(clamp(value + 1)),
					className: "w-12 cursor-pointer text-mute hover:bg-raise hover:text-fg disabled:cursor-not-allowed disabled:opacity-30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, {
						size: 18,
						className: "mx-auto"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 grid grid-cols-4 gap-1.5",
			children: [.../* @__PURE__ */ new Set([
				1,
				5,
				10,
				max
			])].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: n > max || disabled,
				onClick: () => onChange(n),
				className: `h-8 cursor-pointer rounded-md text-[11px] font-bold tabular-nums transition disabled:cursor-not-allowed disabled:opacity-30 ${value === n ? "bg-lime text-bg" : "bg-raise text-mute hover:text-fg"}`,
				children: n === max && n > 10 ? `Tối đa ${n}` : n
			}, n))
		})
	] });
}
// src/features/shop/BuyDialog.jsx
var ALREADY_OWNED = /đã (mua|sở hữu|có)|already/i;
function BuyDialog({ item, category, user, onUser, onOwned, onBought, onClose, onTopUp }) {
	const [qty, setQty] = (0, import_react.useState)(1);
	const [buying, setBuying] = (0, import_react.useState)(false);
	const once = !!item?.once;
	const priced = hasPrice(item);
	const maxQty = once ? 1 : item ? Math.max(1, priced && item.price > 0 ? Math.min(100, Math.floor(user.coins / item.price)) : 100) : 1;
	const total = priced ? item.price * qty : 0;
	const short = priced ? total - user.coins : 0;
	const confirm = async () => {
		if (buying || short > 0) return;
		setBuying(true);
		try {
			const r = await buy(item.id, once ? 1 : qty);
			if (r.user) onUser(r.user);
			if (once) onOwned(item.id);
			toast(r.message || (once ? `Đã mua ${item.name}` : `Đã mua ${qty} × ${item.name}`));
			onBought?.();
			onClose();
		} catch (e) {
			if (once && ALREADY_OWNED.test(e.message)) {
				onOwned(item.id);
				onClose();
			}
			toastError(e);
		} finally {
			setBuying(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!item,
		title: "Mua vật phẩm",
		onClose: () => !buying && onClose(),
		children: item && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					p: item,
					size: "lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-mute",
							children: category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base leading-tight font-extrabold",
							children: item.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex items-center gap-1.5 text-[11px] text-mute",
							children: [item.id, priced && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"· ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 12 }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-coin",
									children: formatNumber(item.price)
								}),
								" / cái"
							] })]
						})
					]
				})]
			}),
			once ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-center gap-2 rounded-lg border border-dashed border-line p-3 text-[11px] text-mute",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLock, {
					size: 15,
					className: "shrink-0 text-lime"
				}), " Vật phẩm chỉ mua được một lần · số lượng 1"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantityPicker, {
				value: qty,
				max: maxQty,
				disabled: buying,
				onChange: setQty,
				onEnter: confirm
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "space-y-2 rounded-xl bg-bg p-4 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-mute",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Số dư hiện tại" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: formatNumber(user.coins)
					})]
				}), priced && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-mute",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Số dư sau khi mua" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: `tabular-nums ${short > 0 ? "text-bad" : ""}`,
						children: short > 0 ? `Thiếu ${formatNumber(short)}` : formatNumber(user.coins - total)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-line pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-bold",
						children: "Tổng"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: `flex items-center gap-1.5 text-lg font-extrabold tabular-nums ${short > 0 ? "text-bad" : "text-coin"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 18 }),
							" ",
							formatNumber(total)
						]
					})]
				})] })]
			}),
			short > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full bg-coin!",
				onClick: onTopUp,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 16 }), " Không đủ xu — Mua thêm"]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "w-full",
				loading: buying,
				onClick: confirm,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCheck, {
					size: 16,
					stroke: 2.6
				}), " Xác nhận mua"]
			}),
			buying && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-[11px] text-mute",
				children: "Đang xử lý…"
			})
		] })
	});
}
// src/features/shop/CategoryNav.jsx
var CoinIcon = ({ size }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size });
function CategoryButton({ id, name, Icon, count, accent, on, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "tab",
		"aria-selected": on,
		onClick: () => {
			onSelect(id);
			if (window.scrollY > 0) window.scrollTo({ top: 0 });
		},
		className: `flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold transition md:w-full ${on ? accent ? "bg-coin text-bg" : "bg-raise text-fg" : "text-mute hover:bg-panel hover:text-fg"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				size: 17,
				className: on && !accent ? "text-lime" : ""
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 whitespace-nowrap",
				children: name
			}),
			count !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `rounded px-1.5 text-[10px] tabular-nums ${on ? "bg-bg/40" : "bg-panel"} ${count === 0 ? "opacity-40" : ""}`,
				children: formatNumber(count)
			})
		]
	});
}
function CategoryNav({ tabs, tabId, hits, onSelect }) {
	const list = tabs || [];
	const isOn = (id) => tabId === id || !tabId && id === list[0]?.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "sticky top-(--app-header-h) z-20 border-b border-line bg-bg/90 backdrop-blur-md supports-backdrop-filter:bg-bg/75 md:top-[calc(var(--app-header-h)+1rem)] md:max-h-[calc(100dvh-var(--app-header-h)-2rem)] md:self-start md:overflow-y-auto md:border-0 md:bg-transparent md:backdrop-blur-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hidden px-3 pb-2 text-[10px] font-bold tracking-[0.2em] text-mute uppercase md:block",
			children: "Danh mục"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "tablist",
			className: "no-scrollbar flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:overflow-visible md:p-0",
			children: [
				tabs ? list.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryButton, {
					id: t.id,
					name: t.name,
					Icon: CATEGORY_ICONS[t.id] || IconBox,
					count: hits[t.id],
					on: isOn(t.id),
					onSelect
				}, t.id)) : Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8.25 w-28 shrink-0 rounded-lg md:w-full" }, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 w-px shrink-0 bg-line md:mx-0 md:my-2 md:h-px md:w-auto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryButton, {
					id: TOPUP,
					name: "Mua xu",
					Icon: CoinIcon,
					accent: true,
					on: isOn(TOPUP),
					onSelect
				}, TOPUP)
			]
		})]
	});
}
// src/features/shop/EmptyProducts.jsx
function EmptyProducts({ searching, tabs, hits, onSelect }) {
	const elsewhere = searching ? tabs.filter((t) => hits[t.id] > 0) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center text-mute",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPackageOff, {
				size: 34,
				stroke: 1.4
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs",
				children: searching ? "Không có vật phẩm nào khớp trong danh mục này" : "Danh mục chưa có vật phẩm"
			}),
			elsewhere.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-1.5",
				children: elsewhere.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onSelect(t.id),
					className: "cursor-pointer rounded-full border border-line px-3 py-1 text-[11px] text-fg hover:border-lime",
					children: [
						t.name,
						" · ",
						hits[t.id]
					]
				}, t.id))
			})
		]
	});
}
// src/features/shop/ProductItem.jsx
function ProductItem({ p, poor, owned, onBuy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onBuy,
		disabled: owned,
		className: "group disabled:cursor-default disabled:opacity-55 disabled:hover:border-line disabled:hover:bg-panel flex h-19.5 w-full cursor-pointer items-center gap-3 rounded-xl border border-line bg-panel p-3 text-left transition hover:border-mute/60 hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { p }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "line-clamp-2 text-[13px] leading-snug font-bold",
					children: p.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-0.5 block truncate text-[10px] text-mute",
					children: p.id
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex shrink-0 flex-col items-end gap-1.5",
				children: [owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-bold text-ok",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCheck, {
						size: 12,
						stroke: 2.6
					}), " Đã mua"]
				}) : hasPrice(p) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `flex items-center gap-1 text-xs font-bold tabular-nums ${poor ? "text-mute" : "text-coin"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 14 }),
						" ",
						formatNumber(p.price)
					]
				}), !owned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-7 place-items-center rounded-lg bg-raise text-mute transition group-hover:bg-lime group-hover:text-bg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, {
						size: 15,
						stroke: 2.4
					})
				})]
			})
		]
	}) });
}
// src/features/shop/ShopSkeleton.jsx
function ShopSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-busy": "true",
		"aria-label": "Đang tải cửa hàng",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-end gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-32 sm:h-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 flex h-[16.5px] items-center gap-1.5 text-[11px] text-mute",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, {
						size: 12,
						className: "text-lime"
					}), " Đang tải dữ liệu cửa hàng…"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-center gap-2 sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 flex-1 rounded-lg sm:w-72" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-10 rounded-lg" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2 sm:grid-cols-2 xl:grid-cols-3",
			children: Array.from({ length: 9 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: `flex h-19.5 items-center gap-3 rounded-xl border border-line bg-panel p-3 ${i >= 6 ? "hidden sm:flex" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-12 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-2.5 w-1/3" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-end gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-7 rounded-lg" })]
					})
				]
			}, i))
		})]
	});
}
// src/features/shop/ShopToolbar.jsx
function ShopToolbar({ title, count, ownedCount, query, onQuery, loading, onReload }) {
	const needle = query.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex flex-wrap items-end gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-extrabold tracking-tight sm:text-2xl",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 truncate text-[11px] text-mute tabular-nums",
				children: [needle ? `${formatNumber(count)} kết quả cho “${needle}”` : `${formatNumber(count)} vật phẩm`, ownedCount > 0 && ` · đã mua ${ownedCount}`]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full items-center gap-2 sm:w-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-panel px-3 transition focus-within:border-lime sm:w-72",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSearch, {
						size: 15,
						className: "shrink-0 text-mute"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => onQuery(e.target.value),
						placeholder: "Tìm theo tên hoặc mã…",
						className: "min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-mute/60 sm:text-[13px]"
					}),
					query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onQuery(""),
						"aria-label": "Xoá tìm kiếm",
						className: "grid size-6 cursor-pointer place-items-center rounded text-mute hover:text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconX, { size: 14 })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "size-10! px-0!",
				onClick: onReload,
				disabled: loading,
				"aria-label": "Tải lại cửa hàng",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 16 })
			})]
		})]
	});
}
// src/features/shop/GuideVideoDialog.jsx
function GuideVideoDialog({ open, src, title = "Hướng dẫn", onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		title,
		onClose,
		children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			src,
			controls: true,
			autoPlay: true,
			playsInline: true,
			className: "max-h-[70dvh] w-full rounded-xl bg-black object-contain"
		})
	});
}
// src/features/shop/PurchaseDoneDialog.jsx
var LOCK_SECONDS = 5;
var VIDEO_URL = `/animalrestaurantshop/videos/done.mp4`;
function PurchaseDoneDialog({ open, onClose }) {
	const [left, setLeft] = (0, import_react.useState)(LOCK_SECONDS);
	const [video, setVideo] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setLeft(LOCK_SECONDS);
		setVideo(false);
		const timer = setInterval(() => setLeft((n) => Math.max(0, n - 1)), 1e3);
		return () => clearInterval(timer);
	}, [open]);
	const locked = left > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		title: "Mua thành công",
		onClose: () => !locked && onClose(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-xl bg-bg p-3 text-xs text-mute",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCircleCheck, {
					size: 18,
					className: "mt-0.5 shrink-0 text-ok"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "whitespace-pre-line",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-fg",
							children: "Đã mua vật phẩm thành công"
						}),
						"\n",
						"Vui lòng xóa dữ liệu trò chơi hoặc xóa và tải lại trò chơi để vật phẩm được khả dụng"
					]
				})]
			}),
			video && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: VIDEO_URL,
				controls: true,
				autoPlay: true,
				playsInline: true,
				className: "max-h-[70dvh] w-full rounded-xl bg-black object-contain"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					onClick: () => setVideo(true),
					disabled: video,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlayerPlay, { size: 15 }), " Xem hướng dẫn"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: locked,
					onClick: onClose,
					children: locked ? `Đóng (${left}s)` : "Đóng"
				})]
			})
		]
	});
}
// src/features/shop/Shop.jsx
var START_VIDEO = `/animalrestaurantshop/videos/start.mp4`;
function useOwned(resetKey) {
	const [ownedIds, setOwnedIds] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => setOwnedIds(/* @__PURE__ */ new Set()), [resetKey]);
	const isOwned = (p) => !!p?.once && (p.owned || ownedIds.has(p.id));
	const markOwned = (id) => setOwnedIds((s) => new Set(s).add(id));
	return {
		isOwned,
		markOwned
	};
}
function Shop({ user, onUser, shop, onReload, onRefresh }) {
	const tabs = shop.tabs || [];
	const [tabId, setTabId] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [shown, setShown] = (0, import_react.useState)(60);
	const [item, setItem] = (0, import_react.useState)(null);
	const [guide, setGuide] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const { isOwned, markOwned } = useOwned(shop.tabs);
	(0, import_react.useEffect)(() => {
		if (tabId !== "__topup" && tabs.length && !tabs.some((t) => t.id === tabId)) setTabId(tabs[0].id);
	}, [tabs, tabId]);
	(0, import_react.useEffect)(() => setShown(60), [tabId, q]);
	const topup = tabId === TOPUP;
	const current = tabs.find((t) => t.id === tabId);
	const needle = q.trim().toLowerCase();
	const products = (0, import_react.useMemo)(() => (Array.isArray(current?.products) ? current.products : []).filter((p) => matches(p, needle)), [current, needle]);
	const hits = (0, import_react.useMemo)(() => Object.fromEntries(tabs.map((t) => {
		const products = Array.isArray(t.products) ? t.products : [];
		return [t.id, needle ? products.filter((p) => matches(p, needle)).length : products.length];
	})), [tabs, needle]);
	const open = (p) => {
		if (isOwned(p)) return;
		setItem(p);
	};
	const renderCatalogue = () => {
		if (shop.ready === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-h-[min(26rem,calc(100dvh-12rem))] items-center justify-center p-4 sm:p-8",
			role: "alert",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md rounded-2xl border border-bad/40 bg-panel p-5 text-center shadow-lg shadow-black/10 sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-bold",
						children: "Cửa hàng chưa sẵn sàng"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-mute",
						children: shop.readyMessage
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-2 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => setGuide(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlayerPlay, { size: 16 }), " Xem hướng dẫn"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							loading: shop.loading,
							onClick: onReload,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 16 }), " Kiểm tra lại"]
						})]
					})
				]
			})
		});
		if (!shop.tabs) return shop.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			message: shop.error,
			onRetry: onReload,
			loading: shop.loading
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopSkeleton, {});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopToolbar, {
				title: current?.name,
				count: products.length,
				ownedCount: products.filter((p) => isOwned(p)).length,
				query: q,
				onQuery: setQ,
				loading: shop.loading,
				onReload
			}),
			products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyProducts, {
				searching: !!needle,
				tabs,
				hits,
				onSelect: setTabId
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: `grid animate-fade gap-2 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${shop.loading ? "pointer-events-none opacity-50" : ""}`,
				children: products.slice(0, shown).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductItem, {
					p,
					owned: isOwned(p),
					poor: hasPrice(p) && p.price > user.coins,
					onBuy: () => open(p)
				}, p.id))
			}, tabId),
			products.length > shown && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-mute tabular-nums",
					children: [
						"Đang hiện ",
						formatNumber(shown),
						" / ",
						formatNumber(products.length)
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setShown((n) => n + 120),
					children: "Xem thêm"
				})]
			})
		] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: shop.ready === false ? "md:px-6 md:py-6" : "md:grid md:grid-cols-[220px_1fr] md:gap-6 md:px-6 md:py-6",
		children: [
			shop.ready !== false && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryNav, {
				tabs: shop.tabs,
				tabId,
				hits,
				onSelect: setTabId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "app-screen min-w-0 md:p-0",
				children: topup && shop.ready !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopUp, {
					user,
					onPaid: onRefresh
				}) : renderCatalogue()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyDialog, {
				item,
				category: current?.name,
				user,
				onUser,
				onOwned: markOwned,
				onBought: () => setDone(true),
				onClose: () => setItem(null),
				onTopUp: () => {
					setItem(null);
					setTabId(TOPUP);
				}
			}, item?.id ?? ""),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PurchaseDoneDialog, {
				open: done,
				onClose: () => setDone(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideVideoDialog, {
				open: guide,
				src: START_VIDEO,
				onClose: () => setGuide(false)
			})
		]
	});
}
export { Shop as default };
