import { Bt as Field, Dt as ErrorState, Et as Skeleton, Ft as Menu, I as adminDeleteGiftCode, It as Dialog, M as adminCreateGiftCode, Ot as Spinner, Rt as toast, T as formatNumber, Tt as RowSkeleton, U as adminGiftCodes, Vt as Button, Wt as IconRefresh, Z as adminUsers, Zt as require_jsx_runtime, in as __toESM, rn as require_react, w as formatDateTime, wt as PagerSkeleton, xt as SearchInput, yt as Coin, z as adminEditGiftCode, zt as toastError } from "./index.js";
import { t as IconGift } from "./IconGift.js";
import { n as usePaginatedData, r as IconPencil, t as useRemoteResource } from "./useRemoteResource.js";
import { t as IconPlus } from "./IconPlus.js";
import { t as IconTrash } from "./IconTrash.js";
import { i as EMPTY_GIFT_CODE } from "./config.js";
import { t as Head } from "./Head.js";
// src/features/administration/GiftCodes.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function GiftCodeRow({ giftcode, onEdit, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-9 shrink-0 place-items-center rounded-lg bg-raise text-lime",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconGift, { size: 17 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-bold",
					children: giftcode.code
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 truncate text-[11px] text-mute",
					children: [
						"Hạn dùng: ",
						giftcode.date ? formatDateTime(giftcode.date) : "Không giới hạn",
						" · Đã dùng ",
						(giftcode.used || []).length.toLocaleString("vi-VN"),
						" · Cập nhật ",
						formatDateTime(giftcode.updatedAt)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden shrink-0 items-center gap-1.5 text-sm font-bold tabular-nums text-coin sm:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 15 }),
					" ",
					formatNumber(giftcode.coin)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { items: [{
				label: "Sửa",
				Icon: IconPencil,
				onClick: onEdit
			}, {
				label: "Xoá",
				Icon: IconTrash,
				danger: true,
				onClick: onDelete
			}] })
		]
	});
}
var userId = (user) => String(user?._id ?? user?.id ?? "");
var selectedIds = (list) => (list || []).map((user) => String(typeof user === "object" ? user._id ?? user.id : user)).filter(Boolean);
var identicalIds = (left, right) => left.length === right.length && left.every((id) => right.includes(id));
function UserAssignment({ title, description, users, usersLoading, selected, onChange }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const selectedSet = new Set(selected);
	const filtered = (users || []).filter((user) => {
		const searchable = `${user.username || ""} ${user.playerName || user.name || ""} ${user.openid || ""} ${userId(user)}`.toLowerCase();
		return !selectedSet.has(userId(user)) && searchable.includes(query.trim().toLowerCase());
	});
	const selectedUsers = selected.map((id) => (users || []).find((user) => userId(user) === id) || { _id: id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-2 rounded-xl border border-line bg-bg p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-bold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] text-mute",
				children: description
			})] }),
			selectedUsers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: selectedUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					title: "Bấm để bỏ người dùng",
					onClick: () => onChange(selected.filter((id) => id !== userId(user))),
					className: "max-w-full cursor-pointer truncate rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[11px] font-bold text-lime hover:bg-lime/20",
					children: [user.username || user.openid || userId(user), " ×"]
				}, userId(user)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
				value: query,
				onChange: setQuery,
				label: "Tìm người dùng để thêm",
				placeholder: "Tìm người dùng để thêm…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-40 overflow-y-auto rounded-lg border border-line bg-panel",
				children: usersLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-3 text-[11px] text-mute",
					children: "Đang tải danh sách người dùng…"
				}) : filtered.length ? filtered.slice(0, 50).map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChange([...selected, userId(user)]),
					className: "flex w-full min-w-0 cursor-pointer items-center gap-2 border-b border-line px-3 py-2 text-left last:border-0 hover:bg-raise",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-7 shrink-0 place-items-center rounded-md bg-raise text-[11px] font-bold text-lime",
							children: (user.username || "?")[0].toUpperCase()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs font-bold",
								children: user.username || "Không có tên"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-[11px] text-mute",
								children: user.playerName || user.name || user.openid || userId(user)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[11px] text-lime",
							children: "Thêm"
						})
					]
				}, userId(user))) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-3 text-[11px] text-mute",
					children: query ? "Không tìm thấy người dùng" : "Không còn người dùng để thêm"
				})
			})
		]
	});
}
function GiftCodeDialog({ dialog, form, setForm, busy, onClose, onCreate, onEdit, users, usersLoading, selectedUsers, setSelectedUsers, selectedUsed, setSelectedUsed }) {
	const editing = dialog?.kind === "edit";
	const setField = (key) => (event) => setForm((state) => ({
		...state,
		[key]: event.target.value
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: dialog?.kind === "create" || editing,
		title: editing ? `Sửa mã đổi thưởng ${dialog?.giftcode?.code}` : "Thêm mã đổi thưởng",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			noValidate: true,
			className: "space-y-4",
			onSubmit: editing ? onEdit : onCreate,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mã đổi thưởng",
					placeholder: "GIFTCODE",
					autoFocus: true,
					autoCapitalize: "characters",
					value: form.code,
					onChange: setField("code")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Số xu",
					type: "number",
					inputMode: "numeric",
					placeholder: "100",
					value: form.coin,
					onChange: setField("coin")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Ngày hết hạn",
					type: "datetime-local",
					hint: "để trống nếu không giới hạn",
					value: form.date,
					onChange: setField("date")
				}),
				editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAssignment, {
					title: "Người dùng được phép dùng",
					description: "Chỉ các tài khoản được chọn mới dùng được mã đổi thưởng này.",
					users,
					usersLoading,
					selected: selectedUsers,
					onChange: setSelectedUsers
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAssignment, {
					title: "Đã sử dụng",
					description: "Danh sách người đã đổi thưởng. Có thể thêm hoặc bỏ để chỉnh trạng thái đã dùng.",
					users,
					usersLoading,
					selected: selectedUsed,
					onChange: setSelectedUsed
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					loading: busy,
					children: editing ? "Lưu thay đổi" : "Thêm mã đổi thưởng"
				})
			]
		})
	});
}
function DeleteDialog({ giftcode, busy, onClose, onConfirm }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open: !!giftcode,
		title: "Xoá mã đổi thưởng",
		onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-mute",
			children: [
				"Xoá mã đổi thưởng ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: "text-fg",
					children: giftcode?.code
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
				onClick: onConfirm,
				children: "Xoá"
			})]
		})]
	});
}
function GiftCodes() {
	const { data: list, loading, error, reload: load } = useRemoteResource(async () => (await adminGiftCodes()).giftcodes);
	const { data: users, loading: usersLoading } = useRemoteResource(async () => (await adminUsers()).users);
	const [query, setQuery] = (0, import_react.useState)("");
	const pageSize = 10;
	const [dialog, setDialog] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY_GIFT_CODE);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [selectedUsers, setSelectedUsers] = (0, import_react.useState)([]);
	const [selectedUsed, setSelectedUsed] = (0, import_react.useState)([]);
	const matching = (0, import_react.useMemo)(() => {
		const search = query.trim().toLowerCase();
		return list?.filter((entry) => !search || String(entry.code ?? "").toLowerCase().includes(search));
	}, [list, query]);
	const { rows, pager } = usePaginatedData(matching, pageSize, query);
	const close = () => !busy && setDialog(null);
	const openCreate = () => {
		setForm(EMPTY_GIFT_CODE);
		setSelectedUsers([]);
		setSelectedUsed([]);
		setDialog({ kind: "create" });
	};
	const openEdit = (giftcode) => {
		setForm({
			code: giftcode.code ?? "",
			coin: String(giftcode.coin ?? ""),
			date: giftcode.date ? String(giftcode.date).slice(0, 16) : ""
		});
		setSelectedUsers(selectedIds(giftcode.users));
		setSelectedUsed(selectedIds(giftcode.used));
		setDialog({
			kind: "edit",
			giftcode
		});
	};
	const run = async (action, message) => {
		setBusy(true);
		try {
			const result = await action();
			toast(result?.message || message);
			setDialog(null);
			load();
		} catch (error) {
			toastError(error);
		} finally {
			setBusy(false);
		}
	};
	const values = () => {
		const code = form.code.trim().toUpperCase();
		const coin = Number(form.coin);
		if (!code) return toast("Nhập mã đổi thưởng", "err");
		if (!Number.isSafeInteger(coin) || coin <= 0) return toast("Nhập số xu hợp lệ", "err");
		return {
			code,
			coin,
			date: form.date ? new Date(form.date).toISOString() : null
		};
	};
	const create = (event) => {
		event.preventDefault();
		const value = values();
		if (value) run(() => adminCreateGiftCode(value), "Đã thêm mã đổi thưởng");
	};
	const edit = (event) => {
		event.preventDefault();
		const value = values();
		if (!value) return;
		const previous = dialog.giftcode;
		const patch = {};
		if (value.code !== previous.code) patch.code = value.code;
		if (value.coin !== Number(previous.coin)) patch.coin = value.coin;
		const previousDate = previous.date ? new Date(previous.date).toISOString() : null;
		if (value.date !== previousDate) patch.date = value.date;
		if (!identicalIds(selectedUsers, selectedIds(previous.users))) patch.users = selectedUsers;
		if (!identicalIds(selectedUsed, selectedIds(previous.used))) patch.used = selectedUsed;
		if (!Object.keys(patch).length) return toast("Chưa có thay đổi nào", "info");
		run(() => adminEditGiftCode(previous.code, patch), "Đã cập nhật mã đổi thưởng");
	};
	const remove = () => run(() => adminDeleteGiftCode(dialog.giftcode.code), "Đã xoá mã đổi thưởng");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
					title: "Mã đổi thưởng",
					sub: list ? `${list.length.toLocaleString("vi-VN")} mã` : "Đang tải danh sách…",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: load,
							disabled: loading,
							"aria-label": "Tải lại danh sách mã đổi thưởng",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 16 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: openCreate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { size: 17 }), " Thêm mã đổi thưởng"]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
					value: query,
					onChange: setQuery,
					label: "Tìm mã đổi thưởng",
					placeholder: "Tìm mã đổi thưởng…"
				}),
				!list && loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"aria-busy": "true",
					className: "divide-y divide-line rounded-2xl border border-line bg-panel",
					children: Array.from({ length: Math.min(pageSize, 10) }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowSkeleton, {
						w: index % 2 ? "w-1/3" : "w-1/4",
						trail: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "hidden h-3.5 w-14 sm:block" })
					}, index))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagerSkeleton, {})] }) : !list && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					message: error,
					onRetry: load,
					loading
				}) : matching?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: `divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${loading ? "opacity-50" : ""}`,
					children: rows.map((giftcode, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftCodeRow, {
						giftcode,
						onEdit: () => openEdit(giftcode),
						onDelete: () => setDialog({
							kind: "delete",
							giftcode
						})
					}, `${giftcode.code || "giftcode"}-${index}`))
				}) : null,
				pager,
				list && !matching?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute",
					children: query ? "Không tìm thấy mã đổi thưởng phù hợp" : "Chưa có mã đổi thưởng nào"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftCodeDialog, {
			dialog,
			form,
			setForm,
			busy,
			onClose: close,
			onCreate: create,
			onEdit: edit,
			users,
			usersLoading,
			selectedUsers,
			setSelectedUsers,
			selectedUsed,
			setSelectedUsed
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteDialog, {
			giftcode: dialog?.kind === "delete" ? dialog.giftcode : null,
			busy,
			onClose: close,
			onConfirm: remove
		})
	] });
}
export { GiftCodes as default };
