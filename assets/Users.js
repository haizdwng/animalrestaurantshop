import { $ as Coin, Ft as __toESM, Ot as createReactComponent, Pt as require_react, St as IconRefresh, Z as isAdmin, _t as toastError, at as Skeleton, bt as require_jsx_runtime, c as adminAddCoin, ft as SortSelect, gt as toast, i as formatDateTime, it as RowSkeleton, j as adminUsers, mt as Dialog, ot as ErrorState, p as adminCreateUser, pt as Menu, rt as PagerSkeleton, st as Spinner, ut as PageSizeSelect, v as adminDeleteUser, vt as Field, x as adminEditUser, yt as Button } from "./index.js";
import { t as IconSearch } from "./IconSearch.js";
import { t as IconUserPlus } from "./IconUserPlus.js";
import { a as EMPTY_USER_FORM, n as COIN_PRESETS, s as USER_SORTS } from "./config.js";
import { i as validate } from "./validate.js";
import { n as usePaginatedData, t as useRemoteResource } from "./useRemoteResource.js";
import { t as Head } from "./Head.js";
import { t as IconPencil } from "./IconPencil.js";
import { t as IconTrash } from "./IconTrash.js";
/**
* @license @tabler/icons-react v3.51.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconCoins = createReactComponent("outline", "coins", "Coins", [
	["path", {
		"d": "M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3",
		"key": "svg-0"
	}],
	["path", {
		"d": "M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4",
		"key": "svg-1"
	}],
	["path", {
		"d": "M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598",
		"key": "svg-2"
	}],
	["path", {
		"d": "M3 6v10c0 .888 .772 1.45 2 2",
		"key": "svg-3"
	}],
	["path", {
		"d": "M3 11c0 .888 .772 1.45 2 2",
		"key": "svg-4"
	}]
]);
// src/features/administration/UserDialogs.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function UserDialogs({ dlg, f, setF, busy, onClose, onCreate, onEdit, onCoin, onDelete }) {
	const set = (k) => (e) => setF((s) => ({
		...s,
		[k]: e.target.value
	}));
	const setUsername = (e) => setF((s) => ({
		...s,
		username: e.target.value.replace(/\s/g, "")
	}));
	const name = dlg?.user?.username ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dlg?.kind === "create",
			title: "Thêm người dùng",
			onClose,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				noValidate: true,
				className: "space-y-4",
				onSubmit: onCreate,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mã người chơi",
						placeholder: "openid",
						autoFocus: true,
						autoCapitalize: "none",
						value: f.openid,
						onChange: set("openid")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tên đăng nhập",
						placeholder: "username",
						autoCapitalize: "none",
						value: f.username,
						onChange: setUsername
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mật khẩu",
						placeholder: "password",
						type: "password",
						autoComplete: "new-password",
						value: f.password,
						onChange: set("password")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						loading: busy,
						children: "Thêm"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dlg?.kind === "edit",
			title: `Sửa @${name}`,
			onClose,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				noValidate: true,
				className: "space-y-4",
				onSubmit: onEdit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mã người chơi",
						placeholder: "newopenid",
						autoCapitalize: "none",
						value: f.openid,
						onChange: set("openid")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tên đăng nhập",
						placeholder: "newusername",
						autoCapitalize: "none",
						value: f.username,
						onChange: setUsername
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mật khẩu mới",
						placeholder: "newpassword",
						hint: "để trống nếu không đổi",
						type: "password",
						autoComplete: "new-password",
						value: f.password,
						onChange: set("password")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						loading: busy,
						children: "Lưu thay đổi"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dlg?.kind === "coin",
			title: `Thêm xu cho @${name}`,
			onClose,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				noValidate: true,
				className: "space-y-4",
				onSubmit: onCoin,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center justify-between rounded-lg bg-bg p-3 text-xs text-mute",
						children: ["Số xu hiện có", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
							className: "flex items-center gap-1.5 tabular-nums text-coin",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 14 }),
								" ",
								(dlg?.user?.coin ?? 0).toLocaleString("vi-VN")
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Số xu",
						hint: "số âm để trừ",
						type: "number",
						inputMode: "numeric",
						autoFocus: true,
						value: f.coin,
						onChange: set("coin")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2",
						children: COIN_PRESETS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: () => setF((s) => ({
								...s,
								coin: String(n)
							})),
							children: ["+", n.toLocaleString("vi-VN")]
						}, n))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						loading: busy,
						children: "Xác nhận"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open: dlg?.kind === "delete",
			title: "Xoá người dùng",
			onClose,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-mute",
				children: [
					"Xoá vĩnh viễn tài khoản ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
						className: "text-fg",
						children: ["@", dlg?.user?.username]
					}),
					"? Hành động này không thể hoàn tác."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					children: "Huỷ"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					loading: busy,
					onClick: onDelete,
					children: "Xoá"
				})]
			})]
		})
	] });
}
// src/features/administration/UserRow.jsx
function UserRow({ user: u, onAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-3 px-4 py-3 sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-9 shrink-0 place-items-center rounded-lg bg-raise text-sm font-extrabold text-lime uppercase",
				children: (u.username || "?")[0]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 truncate text-sm font-bold",
					children: [u.username, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `rounded-full px-2 py-0.5 text-[10px] ${isAdmin(u) ? "bg-lime/15 text-lime" : "bg-raise text-mute"}`,
						children: u.role === "user" ? "Người dùng" : "Quản trị viên"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 truncate text-[11px] text-mute",
					children: [
						u.openid || "—",
						" · ",
						formatDateTime(u.createdAt)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden items-center gap-1.5 text-sm font-bold tabular-nums text-coin sm:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 15 }),
					" ",
					u.coin.toLocaleString("vi-VN")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { items: [
				{
					label: "Sửa",
					Icon: IconPencil,
					onClick: () => onAction("edit")
				},
				{
					label: "Thêm xu",
					Icon: IconCoins,
					onClick: () => onAction("coin")
				},
				{
					label: "Xoá",
					Icon: IconTrash,
					danger: true,
					onClick: () => onAction("delete")
				}
			] })
		]
	});
}
// src/features/administration/Users.jsx
var SKELETON_WIDTHS = [
	"w-1/4",
	"w-1/3",
	"w-1/5"
];
var SEARCH_FIELDS = [
	"username",
	"openid",
	"id",
	"role"
];
function AdminUsers() {
	const { data: list, loading, error, reload: load } = useRemoteResource(async () => (await adminUsers()).users);
	const [q, setQ] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)(USER_SORTS[0][0]);
	const [size, setSize] = (0, import_react.useState)(10);
	const [dlg, setDlg] = (0, import_react.useState)(null);
	const [f, setF] = (0, import_react.useState)(EMPTY_USER_FORM);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const shown = (0, import_react.useMemo)(() => {
		const s = q.trim().toLowerCase();
		const hit = !s ? list : list?.filter((u) => SEARCH_FIELDS.some((k) => String(u[k] ?? "").toLowerCase().includes(s)));
		const comparator = USER_SORTS.find((x) => x[0] === sort)?.[2] || USER_SORTS[0][2];
		return hit && [...hit].sort(comparator);
	}, [
		list,
		q,
		sort
	]);
	const { rows, pager } = usePaginatedData(shown, size, q + sort);
	const open = (kind, user) => {
		setF(kind === "edit" ? {
			...EMPTY_USER_FORM,
			openid: user.openid ?? "",
			username: user.username ?? ""
		} : EMPTY_USER_FORM);
		setDlg({
			kind,
			user
		});
	};
	const close = () => !busy && setDlg(null);
	const run = async (fn, msg) => {
		setBusy(true);
		try {
			const r = await fn();
			toast(r.message || msg);
			setDlg(null);
			load();
		} catch (e) {
			toastError(e);
		} finally {
			setBusy(false);
		}
	};
	const submitCreate = (e) => {
		e.preventDefault();
		const err = validate.openid(f.openid) || validate.username(f.username.trim()) || validate.password(f.password);
		if (err) return toast(err, "err");
		run(() => adminCreateUser({
			openid: f.openid.trim(),
			username: f.username.trim(),
			password: f.password
		}), "Đã thêm người dùng");
	};
	const submitEdit = (e) => {
		e.preventDefault();
		const u = dlg.user;
		const patch = {};
		if (f.openid.trim() && f.openid.trim() !== u.openid) patch.openid = f.openid.trim();
		if (f.username.trim() && f.username.trim() !== u.username) patch.username = f.username.trim();
		if (f.password) patch.password = f.password;
		const err = patch.username && validate.username(patch.username) || patch.password && validate.password(patch.password);
		if (err) return toast(err, "err");
		if (!Object.keys(patch).length) return toast("Chưa có thay đổi nào", "info");
		run(() => adminEditUser(u.id, patch), "Đã cập nhật người dùng");
	};
	const submitCoin = (e) => {
		e.preventDefault();
		const n = Number(f.coin);
		if (!Number.isFinite(n) || !n) return toast("Nhập số xu hợp lệ", "err");
		run(() => adminAddCoin(dlg.user.id, n), `Đã cộng ${n.toLocaleString("vi-VN")} xu`);
	};
	const submitDelete = () => run(() => adminDeleteUser(dlg.user.id), "Đã xoá người dùng");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
				title: "Người dùng",
				sub: list ? `${list.length.toLocaleString("vi-VN")} tài khoản` : "Đang tải danh sách…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "size-8! p-0!",
						onClick: load,
						disabled: loading,
						"aria-label": "Làm mới",
						children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 14 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => open("create"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconUserPlus, { size: 15 }), " Thêm người dùng"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-[1fr_auto_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex h-10 items-center gap-2 rounded-lg border border-line bg-panel px-3 focus-within:border-lime",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSearch, {
						size: 15,
						className: "text-mute"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Tìm tên đăng nhập, mã người chơi,…",
						className: "min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-mute/50 sm:text-sm"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_auto] gap-2 sm:contents",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortSelect, {
						sorts: USER_SORTS,
						value: sort,
						onChange: setSort
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSizeSelect, {
						value: size,
						onChange: setSize
					})]
				})]
			}),
			!list && loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"aria-busy": "true",
				className: "divide-y divide-line rounded-2xl border border-line bg-panel",
				children: Array.from({ length: Math.min(size, 10) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowSkeleton, {
					w: SKELETON_WIDTHS[i % 3],
					trail: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "hidden h-3.5 w-14 sm:block" })
				}, i))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagerSkeleton, {})] }) : !list && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				message: error,
				onRetry: load,
				loading
			}) : shown?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: `divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${loading ? "opacity-50" : ""}`,
				children: rows.map((u, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRow, {
					user: u,
					onAction: (kind) => open(kind, u)
				}, `${u.id || u.openid || "user"}-${index}`))
			}) : null,
			pager,
			list && !shown?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute",
				children: q ? "Không tìm thấy người dùng phù hợp" : "Chưa có người dùng nào"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserDialogs, {
				dlg,
				f,
				setF,
				busy,
				onClose: close,
				onCreate: submitCreate,
				onEdit: submitEdit,
				onCoin: submitCoin,
				onDelete: submitDelete
			})
		]
	});
}
export { AdminUsers as default };
