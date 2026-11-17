import { $ as createTransaction, Bt as Field, Dt as Skeleton, Ht as IconX, It as Dialog, Jt as IconAlertTriangle, Kt as IconCircleCheck, Nt as Select, Ot as ErrorState, Rt as toast, St as Tooltip, T as formatNumber, Vt as Button, Wt as IconRefresh, Xt as Badge, Yt as createReactComponent, Zt as require_jsx_runtime, _ as productOptions, a as cartTotal, b as resolveCart, c as eligibleCategoryProducts, d as getGroupRemaining, en as useNavigate, f as getPurchaseLimit, g as isOwnedOnce, h as isOnce, i as cartPayload, in as __toESM, kt as Spinner, l as getConditions, m as hasValidPrice, n as addCategoryToCart, nt as ADMIN_MAX_QTY, o as changeCartQuantity, p as hasOptions, qt as IconChevronRight, r as cartCount, rn as require_react, rt as buy, s as clampCartQuantity, tn as useParams, u as getConflictingKeys, v as putInCart, vt as isAdmin, x as unmetConditions, xt as SearchInput, y as removeCategoryFromCart, yt as Coin, zt as toastError } from "./index.js";
import { t as IconTrash } from "./IconTrash.js";
import { i as IconQrcode, t as PaymentDialog } from "./PaymentDialog.js";
import { n as IconCheck, t as IconPhoto } from "./IconPhoto.js";
import { i as IconStar, n as hasPrice, r as matches, t as Tile } from "./Tile.js";
import { t as IconUsers } from "./IconUsers.js";
import { n as IconLock } from "./clipboard.js";
import { t as IconPlus } from "./IconPlus.js";
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconBox = /* @__PURE__ */ createReactComponent("outline", "box", "Box", [
	["path", {
		"d": "M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5",
		"key": "svg-0"
	}],
	["path", {
		"d": "M12 12l8 -4.5",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 12l0 9",
		"key": "svg-2"
	}],
	["path", {
		"d": "M12 12l-8 -4.5",
		"key": "svg-3"
	}]
]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconChefHat = /* @__PURE__ */ createReactComponent("outline", "chef-hat", "ChefHat", [["path", {
	"d": "M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151",
	"key": "svg-0"
}], ["path", {
	"d": "M6.161 17.009l11.839 -.009",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconFish = /* @__PURE__ */ createReactComponent("outline", "fish", "Fish", [
	["path", {
		"d": "M16.69 7.44a6.973 6.973 0 0 0 -1.69 4.56c0 1.747 .64 3.345 1.699 4.571",
		"key": "svg-0"
	}],
	["path", {
		"d": "M2 9.504c7.715 8.647 14.75 10.265 20 2.498c-5.25 -7.761 -12.285 -6.142 -20 2.504",
		"key": "svg-1"
	}],
	["path", {
		"d": "M18 11v.01",
		"key": "svg-2"
	}],
	["path", {
		"d": "M11.5 10.5c-.667 1 -.667 2 0 3",
		"key": "svg-3"
	}]
]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconFlower = /* @__PURE__ */ createReactComponent("outline", "flower", "Flower", [["path", {
	"d": "M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
	"key": "svg-0"
}], ["path", {
	"d": "M12 2a3 3 0 0 1 3 3c0 .562 -.259 1.442 -.776 2.64l-.724 1.36l1.76 -1.893c.499 -.6 .922 -1 1.27 -1.205a2.968 2.968 0 0 1 4.07 1.099a3.011 3.011 0 0 1 -1.09 4.098c-.374 .217 -.99 .396 -1.846 .535l-2.664 .366l2.4 .326c1 .145 1.698 .337 2.11 .576a3.011 3.011 0 0 1 1.09 4.098a2.968 2.968 0 0 1 -4.07 1.098c-.348 -.202 -.771 -.604 -1.27 -1.205l-1.76 -1.893l.724 1.36c.516 1.199 .776 2.079 .776 2.64a3 3 0 0 1 -6 0c0 -.562 .259 -1.442 .776 -2.64l.724 -1.36l-1.76 1.893c-.499 .601 -.922 1 -1.27 1.205a2.968 2.968 0 0 1 -4.07 -1.098a3.011 3.011 0 0 1 1.09 -4.098c.374 -.218 .99 -.396 1.846 -.536l2.664 -.366l-2.4 -.325c-1 -.145 -1.698 -.337 -2.11 -.576a3.011 3.011 0 0 1 -1.09 -4.099a2.968 2.968 0 0 1 4.07 -1.099c.348 .203 .771 .604 1.27 1.205l1.76 1.894c-1 -2.292 -1.5 -3.625 -1.5 -4a3 3 0 0 1 3 -3",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconMail = /* @__PURE__ */ createReactComponent("outline", "mail", "Mail", [["path", {
	"d": "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10",
	"key": "svg-0"
}], ["path", {
	"d": "M3 7l9 6l9 -6",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconMinus = /* @__PURE__ */ createReactComponent("outline", "minus", "Minus", [["path", {
	"d": "M5 12l14 0",
	"key": "svg-0"
}]]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconPackageOff = /* @__PURE__ */ createReactComponent("outline", "package-off", "PackageOff", [
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
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconPlant2 = /* @__PURE__ */ createReactComponent("outline", "plant-2", "Plant2", [
	["path", {
		"d": "M2 9a10 10 0 1 0 20 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M12 19a10 10 0 0 1 10 -10",
		"key": "svg-1"
	}],
	["path", {
		"d": "M2 9a10 10 0 0 1 10 10",
		"key": "svg-2"
	}],
	["path", {
		"d": "M12 4a9.7 9.7 0 0 1 2.99 7.5",
		"key": "svg-3"
	}],
	["path", {
		"d": "M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5",
		"key": "svg-4"
	}]
]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconPlayerPlay = /* @__PURE__ */ createReactComponent("outline", "player-play", "PlayerPlay", [["path", {
	"d": "M7 4v16l13 -8l-13 -8",
	"key": "svg-0"
}]]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconShoppingCart = /* @__PURE__ */ createReactComponent("outline", "shopping-cart", "ShoppingCart", [
	["path", {
		"d": "M4 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M15 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M17 17h-11v-14h-2",
		"key": "svg-2"
	}],
	["path", {
		"d": "M6 5l14 1l-1 7h-13",
		"key": "svg-3"
	}]
]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconWheat = /* @__PURE__ */ createReactComponent("outline", "wheat", "Wheat", [
	["path", {
		"d": "M12.014 21.514v-3.75",
		"key": "svg-0"
	}],
	["path", {
		"d": "M5.93 9.504l-.43 1.604c-.712 2.659 .866 5.391 3.524 6.105c.997 .268 1.993 .535 2.99 .801v-3.44c-.164 -2.105 -1.637 -3.879 -3.676 -4.426l-2.408 -.644",
		"key": "svg-1"
	}],
	["path", {
		"d": "M13.744 11.164c.454 -.454 .815 -.994 1.061 -1.587c.246 -.594 .372 -1.23 .372 -1.873c0 -.643 -.126 -1.279 -.372 -1.872c-.246 -.594 -.606 -1.133 -1.061 -1.588l-1.73 -1.73l-1.73 1.73c-.454 .454 -.815 .994 -1.06 1.588c-.246 .594 -.372 1.23 -.373 1.872c0 .643 .127 1.279 .373 1.873c.246 .594 .606 1.133 1.06 1.587",
		"key": "svg-2"
	}],
	["path", {
		"d": "M18.099 9.504l.43 1.604c.712 2.659 -.866 5.391 -3.525 6.105c-.997 .268 -1.994 .535 -2.99 .801v-3.44c.164 -2.105 1.637 -3.879 3.677 -4.426l2.408 -.644",
		"key": "svg-3"
	}]
]);
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
	"Chọn số xu và tạo mã QR",
	"Quét mã bằng ứng dụng ngân hàng",
	"Xu được cộng khi thanh toán thành công"
];
function BalanceAside({ coins, adding }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "ui-card flex flex-col gap-5 p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs font-semibold text-mute",
					children: "Số dư hiện tại"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-center gap-2 text-3xl font-extrabold text-coin tabular-nums",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 28 }),
						" ",
						formatNumber(coins)
					]
				}),
				adding > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-mute tabular-nums",
					children: ["Sau khi nạp: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
						className: "text-fg",
						children: [formatNumber(coins + adding), " xu"]
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-3 border-t border-line pt-4 text-xs text-mute",
				children: STEPS.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-6 shrink-0 place-items-center rounded-lg bg-raise text-[11px] font-bold text-fg",
						children: index + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pt-0.5 leading-relaxed",
						children: step
					})]
				}, step))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-auto border-t border-line pt-4 text-[11px] text-mute",
				children: "Xem và tiếp tục giao dịch chưa thanh toán ở trang Tài khoản."
			})
		]
	});
}
function TopUp({ user, onPaid }) {
	const [coin, setCoin] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [transaction, setTransaction] = (0, import_react.useState)(null);
	const amount = Number(coin) || 0;
	const pick = (value) => {
		setCoin(String(value));
		setError("");
	};
	const submit = async (event) => {
		event.preventDefault();
		if (!Number.isSafeInteger(amount) || amount < 20) {
			setError(`Tối thiểu 20 xu`);
			return;
		}
		setBusy(true);
		try {
			const response = await createTransaction(amount);
			setTransaction({
				code: response.code,
				qr: response.qr,
				coin: amount,
				amount: response.amount,
				status: "pending",
				expiredAt: response.expiredAt || response.transaction?.expiredAt || null
			});
			toast(response.message || "Đã tạo giao dịch", "info");
		} catch (requestError) {
			toastError(requestError);
			setError(requestError.message || "Không tạo được giao dịch");
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
				className: "ui-card min-w-0 space-y-5 p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "ui-heading",
						children: "Mua xu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "ui-description mt-1",
						children: "Chọn số xu và thanh toán bằng mã QR ngân hàng."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2 sm:grid-cols-6",
						role: "group",
						"aria-label": "Chọn nhanh số xu",
						children: PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => pick(preset),
							"aria-pressed": amount === preset,
							className: `flex min-h-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border text-sm font-bold tabular-nums transition-colors ${amount === preset ? "border-coin bg-coin/10 text-coin" : "border-line bg-bg text-fg hover:border-mute"}`,
							children: [
								formatNumber(preset),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-medium text-mute",
									children: "xu"
								})
							]
						}, preset))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Số xu",
						hint: `Tối thiểu 20`,
						inputMode: "numeric",
						placeholder: "Nhập số xu",
						value: coin,
						onChange: (event) => pick(event.target.value.replace(/\D/g, "").slice(0, 9)),
						error,
						className: "[&_input]:font-bold [&_input]:tabular-nums"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						loading: busy,
						disabled: amount < 20,
						className: "min-h-12 w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconQrcode, { size: 18 }),
							" Tạo mã QR ",
							amount >= 20 && `· ${formatNumber(amount)} xu`
						]
					}),
					busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						role: "status",
						className: "flex items-center gap-2 text-xs text-mute",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 14 }), " Đang tạo giao dịch…"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceAside, {
				coins: user.coins,
				adding: amount
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
				tx: transaction,
				onClose: () => setTransaction(null),
				onChange: setTransaction,
				onPaid: () => {
					setCoin("");
					onPaid?.();
				}
			})
		]
	});
}
// src/features/shop/config.js
var TOPUP = "topup";
var CATEGORY_ICONS = {
	letters: IconMail,
	customers: IconUsers,
	memorials: IconPhoto,
	foods: IconChefHat,
	plants: IconPlant2,
	fishes: IconFish,
	flowers: IconFlower,
	vegetables: IconWheat,
	frames: IconPhoto,
	specials: IconStar,
	items: IconBox
};
// src/features/shop/QuantityPicker.jsx
function QuantityPicker({ value, max, disabled = false, onChange, onEnter, compact = false }) {
	const change = (nextValue) => onChange(clampCartQuantity(nextValue, max));
	const buttonClass = "grid shrink-0 cursor-pointer place-items-center text-mute transition hover:bg-raise hover:text-fg focus-visible:outline-2 focus-visible:outline-lime disabled:cursor-not-allowed disabled:opacity-30";
	const input = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-stretch overflow-hidden rounded-lg border border-line bg-bg transition-colors focus-within:border-lime focus-within:ring-2 focus-within:ring-lime/15 ${compact ? "h-9" : "h-12"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Giảm số lượng",
				disabled: disabled || value <= 1,
				onClick: () => change(value - 1),
				className: `${buttonClass} ${compact ? "w-9" : "w-12"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconMinus, { size: compact ? 15 : 18 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "number",
				inputMode: "numeric",
				min: 1,
				max,
				"aria-label": "Số lượng vật phẩm",
				value,
				disabled,
				onChange: (event) => change(event.target.value),
				onKeyDown: (event) => {
					if (event.key === "Enter" && onEnter) {
						event.preventDefault();
						onEnter();
					}
				},
				className: `min-w-0 flex-1 bg-transparent text-center font-bold tabular-nums outline-none disabled:opacity-60 ${compact ? "w-13 text-xs" : "text-lg"}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Tăng số lượng",
				disabled: disabled || value >= max,
				onClick: () => change(value + 1),
				className: `${buttonClass} ${compact ? "w-9" : "w-12"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { size: compact ? 15 : 18 })
			})
		]
	});
	if (compact) return input;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-[11px] font-medium text-mute",
			children: "Số lượng mỗi lần mua"
		}),
		input,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 grid grid-cols-4 gap-1.5",
			children: [.../* @__PURE__ */ new Set([
				1,
				5,
				10,
				max
			])].map((quantity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: disabled || quantity > max,
				onClick: () => change(quantity),
				className: `h-8 cursor-pointer rounded-lg border text-[11px] font-bold tabular-nums transition disabled:cursor-not-allowed disabled:opacity-30 ${value === quantity ? "border-lime bg-lime text-bg" : "border-line bg-raise text-mute hover:text-fg"}`,
				children: quantity.toLocaleString("vi-VN")
			}, quantity))
		})
	] });
}
// src/features/shop/BuyDialog.jsx
function BuyDialog({ item, category, user, entries = [], cartTotal = 0, maxQuantity = 100, conflictingKeys = /* @__PURE__ */ new Set(), onAdd, onRemove, onClose, onTopUp }) {
	const variantSelectId = (0, import_react.useId)();
	const options = item ? productOptions(item) : [];
	const [selectedKey, setSelectedKey] = (0, import_react.useState)(() => options.find((option) => !isOwnedOnce(option, item))?.key || options[0]?.key || "");
	const [amount, setAmount] = (0, import_react.useState)(1);
	const selected = options.find((option) => option.key === selectedKey) || options[0];
	const selectedInCart = entries.find((entry) => entry.key === selected?.key);
	const cartAmount = selectedInCart?.amount || 0;
	const once = isOnce(selected, item);
	const ownedOnce = isOwnedOnce(selected, item);
	const conflict = conflictingKeys.has(selected?.key);
	const blockedByConditions = unmetConditions(selected, item);
	const available = !ownedOnce && !conflict && !blockedByConditions && hasValidPrice(selected);
	const conditions = selected ? getConditions(selected, item) : [];
	const groupRoom = item?.limit === 1 && hasOptions(item) ? 1 : getGroupRemaining(entries, item, selected?.key);
	const limit = selected ? Math.min(getPurchaseLimit(selected, item, maxQuantity), groupRoom) : 1;
	const quantity = once ? 1 : clampCartQuantity(amount, Math.max(1, limit));
	const total = hasValidPrice(selected) ? selected.price * quantity : 0;
	const replacedTotal = (item?.limit === 1 && hasOptions(item) ? entries.filter((entry) => entry.groupKey === item.key && entry.key !== selected?.key) : []).reduce((sum, entry) => sum + entry.total, 0);
	const nextCartTotal = cartTotal - (selectedInCart?.total || 0) - replacedTotal + total;
	const shortage = Math.max(0, nextCartTotal - (user?.coins || 0));
	(0, import_react.useEffect)(() => {
		setAmount(clampCartQuantity(cartAmount || 1, Math.max(1, limit)));
	}, [
		selectedKey,
		cartAmount,
		limit
	]);
	const add = () => {
		if (!selected || !available || limit < 1) return;
		onAdd(selected, quantity, category, item);
		onClose();
	};
	const remove = () => {
		if (!cartAmount || !selected) return;
		onRemove(selected.key);
		onClose();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!item,
		title: cartAmount ? "Cập nhật giỏ hàng" : "Chi tiết vật phẩm",
		onClose,
		children: item && selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
					p: item,
					size: "lg"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-mute",
							children: category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base leading-tight font-extrabold",
							children: item.name || item.key
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate text-[11px] text-mute",
							title: item.key,
							children: item.key
						}),
						typeof item.owned === "string" && item.owned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-coin",
							children: ["Đang chọn: ", item.owned]
						}),
						typeof item.owned === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-[11px] text-mute",
							children: ["Đã có: ", formatNumber(item.owned)]
						})
					]
				})]
			}),
			hasOptions(item) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: variantSelectId,
					className: "block text-[11px] font-medium text-mute",
					children: "Lựa chọn vật phẩm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					id: variantSelectId,
					label: "Lựa chọn vật phẩm",
					value: selected.key,
					onChange: setSelectedKey,
					className: "h-11! w-full! bg-bg!",
					children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: option.key,
						children: [option.name || option.key, typeof option.owned === "number" ? ` · có ${formatNumber(option.owned)}` : option.owned === true && isOnce(option, item) ? " · đã sở hữu" : option.owned === true ? " · đang dùng" : ""]
					}, option.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-line bg-bg p-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-bold",
						title: selected.key,
						children: selected.name || selected.key
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-[10px] text-mute",
						children: selected.key
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex shrink-0 items-center gap-1 font-extrabold tabular-nums text-coin",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 15 }),
						" ",
						hasValidPrice(selected) ? formatNumber(selected.price) : "—"
					]
				})]
			}),
			typeof selected.owned === "number" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-mute",
				children: ["Số lượng đang có: ", formatNumber(selected.owned)]
			}),
			selected.owned === true && !once && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-line bg-bg px-3 py-2 text-[11px] text-mute",
				children: "Đã sở hữu hoặc đang sử dụng. Bạn vẫn có thể mua tiếp vì vật phẩm này không giới hạn một lần."
			}),
			conditions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded-xl border border-line bg-bg p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-bold",
					children: "Điều kiện mua"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: conditions.map(({ name, already }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2 text-xs",
						children: [already ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCheck, {
							size: 16,
							className: "mt-0.5 shrink-0 text-ok"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconX, {
							size: 16,
							className: "mt-0.5 shrink-0 text-bad"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: already ? "text-mute" : "text-fg",
							children: name
						})]
					}, `${name}-${index}`))
				})]
			}),
			conflict && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-lg border border-bad/40 bg-bad/10 p-3 text-xs text-bad",
				children: "Mã vật phẩm xuất hiện với cấu hình khác nhau ở nhiều danh mục. Backend hiện không cho mua mã này."
			}),
			ownedOnce && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-ok/30 bg-ok/10 p-3 text-xs text-ok",
				children: "Vật phẩm đã sở hữu và chỉ được mua một lần."
			}),
			limit < 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-bad/30 bg-bad/10 p-3 text-xs text-bad",
				children: "Đã đạt giới hạn số lượng của nhóm trong giỏ hàng."
			}),
			once ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2.5 text-[11px] text-mute",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLock, { size: 15 }), " Chỉ được sở hữu một lần"]
			}) : limit === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-line bg-bg px-3 py-2.5 text-[11px] text-mute",
				children: "Mỗi lần mua tối đa 1 vật phẩm. Có thể mua lại ở lần tiếp theo."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantityPicker, {
				value: quantity,
				max: Math.max(1, limit),
				disabled: !available || limit < 1,
				onChange: setAmount,
				onEnter: add
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-line bg-bg px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-bold",
					children: "Thành tiền"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 text-lg font-extrabold tabular-nums text-coin",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 18 }),
						" ",
						formatNumber(total)
					]
				})]
			}),
			shortage > 0 && available && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 rounded-lg border border-coin/30 bg-coin/10 p-3 text-[11px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-coin",
					children: [
						"Thiếu ",
						formatNumber(shortage),
						" xu"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onTopUp,
					className: "cursor-pointer font-bold text-coin underline underline-offset-2",
					children: "Mua xu"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `grid gap-2 ${cartAmount > 0 && !once ? "grid-cols-2" : ""}`,
				children: [cartAmount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "w-full text-bad!",
					onClick: remove,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTrash, { size: 16 }), " Xóa khỏi giỏ"]
				}), (!once || cartAmount === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: !available || limit < 1,
					onClick: add,
					children: [available ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconShoppingCart, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLock, { size: 16 }), ownedOnce ? "Đã mua" : conflict ? "Mã không hợp lệ" : blockedByConditions ? "Chưa đủ điều kiện" : !hasValidPrice(selected) ? "Không có giá" : limit < 1 ? "Đã đủ số lượng" : cartAmount ? "Cập nhật giỏ" : "Thêm vào giỏ"]
				})]
			})
		] })
	});
}
// src/features/shop/CartDialog.jsx
function CartDialog({ open, entries, coins, ready, buying, onClose, onQuantity, onRemove, onClear, onBuy, onTopUp }) {
	const total = cartTotal(entries);
	const shortage = Math.max(0, total - coins);
	const invalid = entries.filter((entry) => entry.invalid);
	const canBuy = entries.length > 0 && ready && !buying && invalid.length === 0 && shortage === 0 && Number.isSafeInteger(total);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		title: "Giỏ hàng",
		onClose: () => !buying && onClose(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-mute",
					children: [
						formatNumber(entries.length),
						" loại · ",
						formatNumber(cartCount(entries)),
						" vật phẩm"
					]
				}), entries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "quiet",
					size: "sm",
					disabled: buying,
					onClick: onClear,
					className: "text-bad!",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTrash, { size: 14 }), " Xóa tất cả"]
				})]
			}),
			entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-2 rounded-xl border border-dashed border-line py-8 text-center text-xs text-mute",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconShoppingCart, {
					size: 30,
					stroke: 1.5
				}), " Chưa có vật phẩm nào trong giỏ."]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: entries.map((entry) => {
					const once = isOnce(entry.product, entry.group);
					const remaining = getGroupRemaining(entries, entry.group, entry.key);
					const limit = Math.max(1, Math.min(entry.limit, remaining));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `rounded-xl border bg-bg p-3 ${entry.invalid ? "border-bad/40" : "border-line"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { p: entry.product }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "truncate text-[10px] text-mute",
												children: [entry.category, entry.group.key !== entry.key ? ` · ${entry.group.name || entry.group.key}` : ""]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "line-clamp-2 text-xs font-bold",
												children: entry.product.name || entry.product.key
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 truncate text-[10px] text-mute",
												children: entry.key
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 flex items-center gap-1 text-[11px] text-coin",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 13 }),
													" ",
													formatNumber(entry.price),
													" / vật phẩm"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `Xóa ${entry.product.name || entry.key} khỏi giỏ`,
										title: "Xóa khỏi giỏ",
										disabled: buying,
										onClick: () => onRemove(entry.key),
										className: "grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-mute transition hover:bg-bad/10 hover:text-bad focus-visible:outline-2 focus-visible:outline-lime disabled:opacity-40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconX, { size: 16 })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between gap-2 border-t border-line pt-3",
								children: [once ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-mute",
									children: "Chỉ mua một lần"
								}) : limit === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-mute",
									children: "Mỗi lần mua 1"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantityPicker, {
									compact: true,
									value: entry.amount,
									max: limit,
									disabled: buying || !ready,
									onChange: (value) => onQuantity(entry.key, value)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1 text-xs font-bold text-coin tabular-nums",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 14 }),
										" ",
										formatNumber(entry.total)
									]
								})]
							}),
							entry.invalid && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								role: "alert",
								className: "mt-2 flex items-start gap-1.5 text-[11px] text-bad",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconAlertTriangle, {
										size: 14,
										className: "mt-0.5 shrink-0"
									}),
									" ",
									entry.invalid
								]
							})
						]
					}, entry.key);
				})
			}),
			entries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-2 rounded-xl border border-line bg-bg p-3.5 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-mute",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Số dư hiện tại" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: formatNumber(coins)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-mute",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Sau khi mua" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: `tabular-nums ${shortage ? "text-bad" : ""}`,
								children: shortage ? `Thiếu ${formatNumber(shortage)}` : formatNumber(coins - total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-line pt-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "font-extrabold",
								children: "Tổng thanh toán"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "flex items-center gap-1.5 text-lg font-extrabold text-coin tabular-nums",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 18 }),
									" ",
									formatNumber(total)
								]
							})]
						})
					]
				}),
				!ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-lg border border-line bg-raise p-3 text-[11px] text-mute",
					children: "Cửa hàng chưa sẵn sàng, vui lòng kiểm tra lại."
				}),
				invalid.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					role: "alert",
					className: "flex items-start gap-2 rounded-lg border border-bad/30 bg-bad/10 p-3 text-[11px] text-bad",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconAlertTriangle, {
							size: 16,
							className: "shrink-0"
						}),
						" ",
						invalid.length,
						" vật phẩm chưa hợp lệ; hãy điều chỉnh trước khi mua."
					]
				}),
				shortage > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "w-full text-coin!",
					disabled: buying,
					onClick: onTopUp,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 16 }),
						" Thiếu ",
						formatNumber(shortage),
						" xu · Mua thêm"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full",
					disabled: !canBuy,
					loading: buying,
					onClick: onBuy,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconShoppingCart, { size: 17 }),
						" Mua tất cả · ",
						formatNumber(entries.length),
						" loại"
					]
				})
			] })
		]
	});
}
// src/features/shop/CategoryNav.jsx
var CoinIcon = ({ size }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size });
function CategoryButton({ id, name, Icon, count, active, featured, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-current": active ? "page" : void 0,
		onClick: () => {
			onSelect(id);
			if (window.scrollY > 0) window.scrollTo({
				top: 0,
				behavior: "auto"
			});
		},
		className: `ui-nav-item relative w-full shrink-0 justify-start text-left md:w-full ${active && featured ? "border-coin/30! bg-coin/10! text-coin!" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				size: 17,
				className: `shrink-0 ${active && !featured ? "text-lime" : ""}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-0 flex-1 whitespace-nowrap",
				children: name
			}),
			count !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `rounded-md px-1.5 text-[10px] tabular-nums ${active ? "bg-bg/60" : "bg-raise"} ${count === 0 ? "opacity-50" : ""}`,
				children: formatNumber(count)
			})
		]
	});
}
function CategoryNav({ tabs, tabId, hits, onSelect }) {
	const categories = tabs || [];
	const active = (id) => tabId === id || !tabId && id === categories[0]?.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "sticky top-(--app-header-h) z-20 min-w-0 border-b border-line bg-bg/95 backdrop-blur-xl md:top-[calc(var(--app-header-h)+1rem)] md:max-h-[calc(100dvh-var(--app-header-h)-2rem)] md:self-start md:overflow-y-auto md:border-0 md:bg-transparent md:backdrop-blur-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "hidden px-3 pb-2 text-[11px] font-bold tracking-wider text-mute uppercase md:block",
			children: "Danh mục"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			"aria-label": "Danh mục cửa hàng",
			className: "no-scrollbar flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:p-0",
			children: [
				tabs ? categories.map(({ id, name }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryButton, {
					id,
					name,
					Icon: CATEGORY_ICONS[id] || IconBox,
					count: hits[id],
					active: active(id),
					onSelect
				}, id)) : Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-27 shrink-0 md:w-full" }, index)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": true,
					className: "mx-1 w-px shrink-0 bg-line md:mx-0 md:my-2 md:h-px md:w-auto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryButton, {
					id: TOPUP,
					name: "Mua xu",
					Icon: CoinIcon,
					active: active(TOPUP),
					featured: true,
					onSelect
				})
			]
		})]
	});
}
// src/features/shop/EmptyProducts.jsx
function EmptyProducts({ searching, tabs = [], hits = {}, onSelect }) {
	const elsewhere = searching ? tabs.filter((tab) => hits[tab.id] > 0) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ui-card flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-12 place-items-center rounded-2xl bg-raise text-mute",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPackageOff, {
					size: 28,
					stroke: 1.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-xs text-xs leading-relaxed text-mute",
				children: searching ? "Không có vật phẩm khớp với tìm kiếm trong danh mục này." : "Danh mục hiện chưa có vật phẩm."
			}),
			elsewhere.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex max-w-full flex-wrap justify-center gap-2",
				children: elsewhere.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => onSelect(tab.id),
					children: [
						tab.name,
						" · ",
						hits[tab.id]
					]
				}, tab.id))
			})
		]
	});
}
// src/features/shop/ProductItem.jsx
function ProductItem({ p, poor, cartQuantity = 0, conflictingKeys = /* @__PURE__ */ new Set(), onBuy }) {
	const grouped = hasOptions(p);
	const options = productOptions(p);
	const owned = grouped ? options.every((option) => isOwnedOnce(option, p)) : isOwnedOnce(p);
	const conflicting = options.some((option) => conflictingKeys.has(option.key));
	const inventory = typeof p.owned === "number" ? `Đang có ${formatNumber(p.owned)}` : "";
	const selected = typeof p.owned === "string" && p.owned ? `Đang chọn: ${p.owned}` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onBuy,
		className: "ui-panel group flex min-h-20 w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors hover:border-mute/70 hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { p }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "line-clamp-2 text-[13px] leading-snug font-bold",
						children: p.name || p.key
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block truncate font-mono text-[10px] text-mute",
						children: p.key
					}),
					grouped && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block text-[11px] text-mute",
						children: [formatNumber(p.options.length), " lựa chọn"]
					}),
					inventory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block truncate text-[11px] text-mute",
						children: inventory
					}),
					selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block truncate text-[11px] text-coin",
						children: selected
					}),
					!owned && p.owned === true && !isOnce(p) && !grouped && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-[11px] text-ok",
						children: "Đã sở hữu · có thể mua tiếp"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex shrink-0 flex-col items-end gap-1.5",
				children: [owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					Icon: IconCheck,
					tone: "success",
					children: "Đã mua"
				}) : conflicting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					Icon: IconLock,
					tone: "danger",
					children: "Mã trùng"
				}) : cartQuantity > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					Icon: IconShoppingCart,
					tone: "accent",
					children: [formatNumber(cartQuantity), " trong giỏ"]
				}) : grouped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-semibold text-mute",
					children: "Chọn loại"
				}) : hasPrice(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `flex items-center gap-1 text-xs font-extrabold tabular-nums ${poor ? "text-mute" : "text-coin"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 15 }),
						" ",
						formatNumber(p.price)
					]
				}) : null, !owned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					"aria-hidden": true,
					className: "grid size-7 place-items-center rounded-lg bg-raise text-mute transition-colors group-hover:bg-line group-hover:text-fg",
					children: grouped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChevronRight, { size: 16 }) : cartQuantity ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCheck, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { size: 16 })
				})]
			})
		]
	}) });
}
// src/features/shop/ShopSkeleton.jsx
function ShopSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-busy": "true",
		"aria-label": "Đang tải cửa hàng",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-end gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-36" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-xs text-mute",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 13 }), " Đang tải cửa hàng…"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-center gap-2 sm:w-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 flex-1 rounded-lg sm:w-72" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-10 rounded-lg" })]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2 sm:grid-cols-2 xl:grid-cols-3",
			children: Array.from({ length: 9 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: `ui-panel flex min-h-20 items-center gap-3 p-3 ${index >= 6 ? "hidden sm:flex" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-12 shrink-0 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-2.5 w-1/3" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-9" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "ml-auto size-7" })]
					})
				]
			}, index))
		})]
	});
}
// src/features/shop/ShopToolbar.jsx
function ShopToolbar({ title, count, ownedCount, query, onQuery, loading, onReload }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-4 flex flex-wrap items-end gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "ui-heading",
				children: title || "Cửa hàng"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "ui-description mt-1 truncate tabular-nums",
				children: [query.trim() ? `${formatNumber(count)} kết quả cho “${query.trim()}”` : `${formatNumber(count)} vật phẩm`, ownedCount > 0 && ` · ${formatNumber(ownedCount)} đã sở hữu`]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full items-center gap-2 sm:w-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
				label: "Tìm vật phẩm",
				placeholder: "Tìm theo tên hoặc mã…",
				value: query,
				onChange: onQuery,
				disabled: loading,
				className: "min-w-0 flex-1 sm:w-72"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
				text: "Tải lại dữ liệu cửa hàng",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "size-10! px-0!",
					onClick: onReload,
					disabled: loading,
					"aria-label": "Tải lại cửa hàng",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 17 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 17 })
				})
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
function Shop({ user, onUser, shop, onReload, onRefresh, onPurchase }) {
	const navigate = useNavigate();
	const { section } = useParams();
	const tabs = shop.tabs || [];
	const tabId = section || tabs[0]?.id || null;
	const [q, setQ] = (0, import_react.useState)("");
	const [shown, setShown] = (0, import_react.useState)(60);
	const [item, setItem] = (0, import_react.useState)(null);
	const [cart, setCart] = (0, import_react.useState)([]);
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const [buying, setBuying] = (0, import_react.useState)(false);
	const [guide, setGuide] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	const maxQuantity = isAdmin(user) ? ADMIN_MAX_QTY : 100;
	const conflicts = (0, import_react.useMemo)(() => getConflictingKeys(shop.tabs), [shop.tabs]);
	const isOwned = (product) => hasOptions(product) ? product.options.every((option) => isOwnedOnce(option, product)) : isOwnedOnce(product);
	const selectTab = (next) => navigate(`/shop/${next}`);
	(0, import_react.useEffect)(() => {
		if (!tabs.length) return;
		if (!section) {
			navigate(`/shop/${tabs[0].id}`, { replace: true });
			return;
		}
		if (section !== "topup" && !tabs.some((tab) => tab.id === section)) navigate(`/shop/${tabs[0].id}`, { replace: true });
	}, [
		tabs,
		section,
		navigate
	]);
	(0, import_react.useEffect)(() => setShown(60), [tabId, q]);
	const topup = tabId === TOPUP;
	const current = tabs.find((tab) => tab.id === tabId);
	const needle = q.trim().toLowerCase();
	const products = (0, import_react.useMemo)(() => (Array.isArray(current?.products) ? current.products : []).filter((p) => matches(p, needle)), [current, needle]);
	const hits = (0, import_react.useMemo)(() => Object.fromEntries(tabs.map((t) => {
		const products = Array.isArray(t.products) ? t.products : [];
		return [t.id, needle ? products.filter((p) => matches(p, needle)).length : products.length];
	})), [tabs, needle]);
	const entries = (0, import_react.useMemo)(() => resolveCart(cart, shop.tabs, maxQuantity), [
		cart,
		shop.tabs,
		maxQuantity
	]);
	const total = cartTotal(entries);
	const cartQuantities = (0, import_react.useMemo)(() => new Map(cart.map(({ key, amount }) => [key, amount])), [cart]);
	const categoryProducts = Array.isArray(current?.products) ? current.products : [];
	const eligible = eligibleCategoryProducts(categoryProducts, conflicts);
	const categoryAddedCount = eligible.filter((product) => cartQuantities.has(product.key)).length;
	const allCategoryAdded = eligible.length > 0 && categoryAddedCount === eligible.length;
	const cartReady = shop.ready === true && Array.isArray(shop.tabs) && !shop.loading;
	const canPurchase = cartReady && entries.every(({ invalid }) => !invalid) && total <= user.coins && Number.isSafeInteger(total);
	const open = (p) => {
		if (buying) return;
		setItem(p);
	};
	const addToCart = (product, amount, category, group = product) => {
		const exists = cart.some((entry) => entry.key === product.key);
		setCart((items) => putInCart(items, product, amount, category, maxQuantity, group, conflicts));
		toast(exists ? "Đã cập nhật số lượng trong giỏ" : "Đã thêm vật phẩm vào giỏ");
	};
	const toggleCategoryCart = () => {
		if (!cartReady || buying || eligible.length === 0) return;
		if (allCategoryAdded) {
			setCart((items) => removeCategoryFromCart(items, categoryProducts));
			toast(`Đã xóa vật phẩm thuộc ${current.name} khỏi giỏ`);
		} else {
			setCart((items) => addCategoryToCart(items, categoryProducts, current.name, maxQuantity, conflicts));
			toast(`Đã thêm các vật phẩm còn lại của ${current.name} vào giỏ`);
		}
	};
	const removeFromCart = (key) => {
		setCart((items) => items.filter((entry) => entry.key !== key));
		if (cart.length === 1) setCartOpen(false);
	};
	const clearCart = () => {
		setCart([]);
		setCartOpen(false);
	};
	const purchase = async () => {
		if (buying || cart.length === 0 || !canPurchase) return;
		setBuying(true);
		try {
			const response = await buy(cartPayload(entries));
			if (response.user) onUser(response.user);
			else if (Number.isSafeInteger(response.coin)) onUser({
				...user,
				coin: response.coin,
				coins: response.coin
			});
			onPurchase?.(cartPayload(entries));
			setCart([]);
			setCartOpen(false);
			setDone(true);
			toast(response.message || `Đã mua ${entries.length} loại vật phẩm thành công`);
		} catch (error) {
			toastError(error);
		} finally {
			setBuying(false);
		}
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
			!topup && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-panel px-3 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-mute",
					children: [
						"Trong danh mục: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
							className: "text-fg tabular-nums",
							children: [
								formatNumber(categoryAddedCount),
								" / ",
								formatNumber(eligible.length)
							]
						}),
						" loại đã thêm",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: " · Các nhóm có tùy chọn cần chọn riêng"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: allCategoryAdded ? "ghost" : "solid",
					className: allCategoryAdded ? "text-bad!" : "",
					disabled: !cartReady || buying || eligible.length === 0,
					onClick: toggleCategoryCart,
					title: allCategoryAdded ? "Xóa các vật phẩm thuộc danh mục hiện tại khỏi giỏ" : "Thêm các vật phẩm đủ điều kiện thuộc toàn bộ danh mục",
					children: [allCategoryAdded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTrash, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconShoppingCart, { size: 15 }), allCategoryAdded ? "Xóa tất cả" : "Thêm tất cả vào giỏ"]
				})]
			}),
			products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyProducts, {
				searching: !!needle,
				tabs,
				hits,
				onSelect: selectTab
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: `grid animate-fade gap-2 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${shop.loading ? "pointer-events-none opacity-50" : ""}`,
				children: products.slice(0, shown).map((p, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductItem, {
					p,
					conflictingKeys: conflicts,
					poor: hasPrice(p) && p.price > user.coins,
					cartQuantity: productOptions(p).reduce((count, option) => count + (cartQuantities.get(option.key) || 0), 0),
					onBuy: () => open(p)
				}, `${p.key}-${index}`))
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
				onSelect: selectTab
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: `app-screen min-w-0 md:p-0 ${cart.length > 0 ? "pb-28 md:pb-24" : ""}`,
				children: topup && shop.ready !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopUp, {
					user,
					onPaid: onRefresh
				}) : renderCatalogue()
			}),
			cart.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-3 bottom-[calc(var(--app-bottom-nav-h)+.75rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md md:right-5 md:bottom-5 md:left-auto md:mx-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setCartOpen(true),
					className: "flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-lime/35 bg-panel px-3 py-3 text-left shadow-xl shadow-black/40 backdrop-blur-md transition hover:border-lime hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative grid size-10 shrink-0 place-items-center rounded-xl bg-lime text-bg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconShoppingCart, {
								size: 20,
								stroke: 2.2
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-2 -right-2 grid min-w-5 h-5 place-items-center rounded-full bg-fg px-1 text-[10px] font-extrabold text-bg tabular-nums",
								children: formatNumber(cart.length)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs font-extrabold",
								children: [
									"Giỏ hàng · ",
									formatNumber(cartCount(entries)),
									" vật phẩm"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-0.5 flex items-center gap-1 text-xs font-bold text-coin",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 13 }),
									" ",
									formatNumber(total)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded-lg bg-lime px-3 py-2 text-[11px] font-extrabold text-bg",
							children: "Xem giỏ & mua"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuyDialog, {
				item,
				category: current?.name,
				user,
				entries,
				conflictingKeys: conflicts,
				cartTotal: total,
				maxQuantity,
				onAdd: addToCart,
				onRemove: removeFromCart,
				onClose: () => setItem(null),
				onTopUp: () => {
					setItem(null);
					selectTab(TOPUP);
				}
			}, item?.key ?? ""),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDialog, {
				open: cartOpen,
				entries,
				coins: user.coins,
				ready: cartReady,
				buying,
				onClose: () => setCartOpen(false),
				onQuantity: (key, amount) => setCart((items) => changeCartQuantity(items, key, amount, maxQuantity)),
				onRemove: removeFromCart,
				onClear: clearCart,
				onBuy: purchase,
				onTopUp: () => {
					setCartOpen(false);
					selectTab(TOPUP);
				}
			}),
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
