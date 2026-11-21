import { A as formatDateTime, At as PagerSkeleton, Bt as Dialog, Dt as SearchInput, G as adminEditGiftCode, Gt as Button, H as adminDeleteGiftCode, Ht as toast, Nt as ErrorState, Pt as Spinner, R as adminCreateGiftCode, Tt as Coin, Ut as toastError, Wt as Field, Y as adminGiftCodes, Yt as IconRefresh, cn as require_react, j as formatNumber, jt as RowSkeleton, ln as __toESM, nn as require_jsx_runtime, rt as adminUsers, zt as Menu } from "./index.js";
import { t as IconGift } from "./IconGift.js";
import { n as IconPencil, t as useRemoteResource } from "./useRemoteResource.js";
import { t as IconPlus } from "./IconPlus.js";
import { t as IconTrash } from "./IconTrash.js";
import { i as EMPTY_GIFT_CODE } from "./config.js";
import { t as Head } from "./Head.js";
import { t as usePaginatedData } from "./usePaginatedData.js";
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
	const selectedSet = (0, import_react.useMemo)(() => new Set(selected), [selected]);
	const available = (0, import_react.useMemo)(() => (users || []).filter((user) => {
		const text = `${user.username || ""} ${user.playerName || user.name || ""} ${user.openid || ""} ${userId(user)}`.toLowerCase();
		return !selectedSet.has(userId(user)) && text.includes(query.trim().toLowerCase());
	}), [
		users,
		selectedSet,
		query
	]);
	const userLookup = (0, import_react.useMemo)(() => new Map((users || []).map((user) => [userId(user), user])), [users]);
	const selectedUsers = (0, import_react.useMemo)(() => selected.map((id) => userLookup.get(id) || { _id: id }), [selected, userLookup]);
	const { rows: selectedRows, pager: selectedPager } = usePaginatedData(selectedUsers, `selected|${selected.join("|")}`);
	const { rows: availableRows, pager: availablePager } = usePaginatedData(available, `available|${query}|${selected.join("|")}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 space-y-3 rounded-xl border border-line bg-bg p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-start justify-between gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-bold",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-mute",
						children: description
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-semibold text-mute",
						children: ["Đã thêm: ", selectedUsers.length.toLocaleString("vi-VN")]
					}),
					selectedRows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line overflow-hidden rounded-lg border border-line bg-panel",
						children: selectedRows.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex min-w-0 items-center justify-between gap-2 px-2.5 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate text-xs",
								children: user.username || user.openid || userId(user)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "quiet",
								size: "sm",
								className: "shrink-0 text-bad!",
								"aria-label": `Bỏ ${user.username || userId(user)}`,
								onClick: () => onChange(selected.filter((id) => id !== userId(user))),
								children: "Bỏ"
							})]
						}, userId(user)))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-dashed border-line p-3 text-[11px] text-mute",
						children: "Chưa thêm người dùng nào"
					}),
					selectedPager
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-line pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-semibold text-mute",
						children: ["Có thể thêm: ", available.length.toLocaleString("vi-VN")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
						value: query,
						onChange: setQuery,
						label: `Tìm ${title.toLowerCase()}`,
						placeholder: "Tìm tên đăng nhập, người chơi, OpenID…"
					}),
					usersLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "p-3 text-[11px] text-mute",
						children: "Đang tải danh sách người dùng…"
					}) : availableRows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-line overflow-hidden rounded-lg border border-line bg-panel",
						children: availableRows.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex min-w-0 items-center justify-between gap-2 px-2.5 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs font-semibold",
									children: user.username || user.openid || userId(user)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-[11px] text-mute",
									children: user.playerName || user.name || user.openid || userId(user)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								className: "shrink-0",
								onClick: () => onChange([...selected, userId(user)]),
								children: "Thêm"
							})]
						}, userId(user)))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-dashed border-line p-3 text-[11px] text-mute",
						children: "Không còn người dùng phù hợp"
					}),
					availablePager
				]
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAssignment, {
					title: "Người dùng được phép dùng",
					users,
					usersLoading,
					selected: selectedUsers,
					onChange: setSelectedUsers
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAssignment, {
					title: "Người dùng đã sử dụng",
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
				requestAction: true,
				loading: busy,
				onClick: onConfirm,
				children: "Xoá"
			})]
		})]
	});
}
function GiftCodes() {
	const { data: users, loading: usersLoading, error: usersError, reload: reloadUsers } = useRemoteResource(async () => (await adminUsers()).users);
	const { data: list, loading, error, reload: load } = useRemoteResource(async () => (await adminGiftCodes()).giftcodes, Array.isArray(users));
	const [query, setQuery] = (0, import_react.useState)("");
	const [dialog, setDialog] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY_GIFT_CODE);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [selectedUsers, setSelectedUsers] = (0, import_react.useState)([]);
	const [selectedUsed, setSelectedUsed] = (0, import_react.useState)([]);
	const matching = (0, import_react.useMemo)(() => {
		const search = query.trim().toLowerCase();
		return list?.filter((entry) => !search || String(entry.code ?? "").toLowerCase().includes(search));
	}, [list, query]);
	const { rows, pager } = usePaginatedData(matching, query);
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
			load();
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
		if (!value) return;
		run(async () => {
			const created = await adminCreateGiftCode(value);
			if (selectedUsers.length || selectedUsed.length) await adminEditGiftCode(value.code, {
				users: selectedUsers,
				used: selectedUsed
			});
			return created;
		}, "Đã thêm mã đổi thưởng");
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
							requestAction: true,
							disabled: loading,
							"aria-label": "Tải lại danh sách mã đổi thưởng",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 16 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: openCreate,
							disabled: !Array.isArray(users),
							"aria-label": "Thêm mã đổi thưởng",
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
				!users && usersError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					message: usersError,
					onRetry: reloadUsers,
					loading: usersLoading
				}) : !list && (loading || usersLoading) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"aria-busy": "true",
					className: "divide-y divide-line rounded-2xl border border-line bg-panel",
					children: Array.from({ length: 10 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowSkeleton, {
						kind: "giftcode",
						w: index % 2 ? "w-1/3" : "w-1/4"
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
