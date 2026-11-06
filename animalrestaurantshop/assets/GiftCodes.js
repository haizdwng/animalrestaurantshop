import { At as require_react, X as Coin, _ as adminEditGiftCode, _t as require_jsx_runtime, dt as Dialog, et as PagerSkeleton, gt as Button, ht as Field, i as formatNumber, it as Spinner, jt as __toESM, k as adminUsers, m as adminDeleteGiftCode, mt as toastError, nt as Skeleton, pt as toast, r as formatDateTime, rt as ErrorState, tt as RowSkeleton, u as adminCreateGiftCode, ut as Menu, x as adminGiftCodes, yt as IconRefresh } from "./index.js";
import { t as IconGift } from "./IconGift.js";
import { t as IconPencil } from "./IconPencil.js";
import { t as IconPlus } from "./IconPlus.js";
import { t as IconTrash } from "./IconTrash.js";
import { i as EMPTY_GIFT_CODE } from "./config.js";
import { n as usePaginatedData, t as useRemoteResource } from "./useRemoteResource.js";
// src/features/administration/GiftCodes.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function GiftCodeRow({ giftcode, onEdit, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-3 px-4 py-3 sm:px-5",
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
						giftcode.used.length.toLocaleString("vi-VN"),
						" · Cập nhật ",
						formatDateTime(giftcode.updatedAt)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden items-center gap-1.5 text-sm font-bold tabular-nums text-coin sm:flex",
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
function userId(user) {
	return String(user?._id ?? user?.id ?? "");
}
function UserAssignment({ users, usersLoading, selected, onChange }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const selectedSet = new Set(selected);
	const filtered = (users || []).filter((user) => {
		const value = `${user.username || ""} ${user.playerName || user.name || ""} ${user.openid || ""} ${userId(user)}`.toLowerCase();
		return !selectedSet.has(userId(user)) && value.includes(query.trim().toLowerCase());
	});
	const selectedUsers = selected.map((id) => (users || []).find((user) => userId(user) === id) || { _id: id });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-2 rounded-xl border border-line bg-bg p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-bold",
				children: "Người dùng được phép dùng"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[10px] text-mute",
				children: "Chỉ các tài khoản được chọn mới dùng được mã đổi thưởng này."
			})] }),
			selectedUsers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: selectedUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChange(selected.filter((id) => id !== userId(user))),
					className: "max-w-full cursor-pointer truncate rounded-full bg-lime/15 px-2.5 py-1 text-[10px] font-bold text-lime hover:bg-lime/25",
					title: "Bấm để bỏ người dùng",
					children: [user.username || user.openid || userId(user), " ×"]
				}, userId(user)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "Tìm người dùng để thêm…",
				className: "h-9 w-full rounded-lg border border-line bg-panel px-3 text-xs outline-none placeholder:text-mute/50 focus:border-lime"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-40 overflow-y-auto rounded-lg border border-line bg-panel",
				children: usersLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-3 text-[11px] text-mute",
					children: "Đang tải danh sách người dùng…"
				}) : filtered.length ? filtered.slice(0, 50).map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onChange([...selected, userId(user)]),
					className: "flex w-full min-w-0 items-center gap-2 border-b border-line px-3 py-2 text-left last:border-0 hover:bg-raise",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-7 shrink-0 place-items-center rounded-md bg-raise text-[10px] font-bold text-lime",
							children: (user.username || "?")[0].toUpperCase()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs font-bold",
								children: user.username || "Không có tên"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-[10px] text-mute",
								children: user.playerName || user.name || user.openid || userId(user)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[10px] text-lime",
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
function UsedUsers({ used, users }) {
	const entries = used.map((id) => {
		const user = (users || []).find((item) => userId(item) === id);
		return {
			id,
			label: user?.username || user?.playerName || user?.openid || id
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-2 rounded-xl border border-line bg-bg p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-bold",
				children: "Đã sử dụng"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[10px] text-mute",
				children: "Lịch sử đổi thưởng."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full bg-raise px-2 py-1 text-[10px] font-bold tabular-nums text-mute",
				children: used.length
			})]
		}), entries.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex max-h-24 flex-wrap gap-1.5 overflow-y-auto",
			children: entries.map(({ id, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				title: id,
				className: "max-w-full truncate rounded-full bg-raise px-2.5 py-1 text-[10px] text-mute",
				children: label
			}, id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-mute",
			children: "Chưa có người dùng nào sử dụng."
		})]
	});
}
function GiftCodeDialog({ dlg, form, setForm, busy, onClose, onCreate, onEdit, users, usersLoading, selectedUsers, setSelectedUsers }) {
	const set = (key) => (e) => setForm((state) => ({
		...state,
		[key]: e.target.value
	}));
	const editing = dlg?.kind === "edit";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: dlg?.kind === "create" || editing,
		title: editing ? `Sửa mã đổi thưởng ${dlg?.giftcode?.code}` : "Thêm mã đổi thưởng",
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
					onChange: set("code")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Số xu",
					type: "number",
					inputMode: "numeric",
					placeholder: "100",
					value: form.coin,
					onChange: set("coin")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Ngày hết hạn",
					type: "datetime-local",
					hint: "để trống nếu không giới hạn",
					value: form.date,
					onChange: set("date")
				}),
				editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserAssignment, {
					users,
					usersLoading,
					selected: selectedUsers,
					onChange: setSelectedUsers
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsedUsers, {
					used: dlg.giftcode.used || [],
					users
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
	const [q, setQ] = (0, import_react.useState)("");
	const [size, setSize] = (0, import_react.useState)(10);
	const [dlg, setDlg] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY_GIFT_CODE);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [selectedUsers, setSelectedUsers] = (0, import_react.useState)([]);
	const shown = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return list?.filter((item) => !query || String(item.code ?? "").toLowerCase().includes(query));
	}, [list, q]);
	const { rows, pager } = usePaginatedData(shown, size, q);
	const close = () => !busy && setDlg(null);
	const openCreate = () => {
		setForm(EMPTY_GIFT_CODE);
		setSelectedUsers([]);
		setDlg({ kind: "create" });
	};
	const openEdit = (giftcode) => {
		setForm({
			code: giftcode.code ?? "",
			coin: String(giftcode.coin ?? ""),
			date: giftcode.date ? String(giftcode.date).slice(0, 16) : ""
		});
		setSelectedUsers((giftcode.users || []).map((user) => String(typeof user === "object" ? user._id ?? user.id : user)).filter(Boolean));
		setDlg({
			kind: "edit",
			giftcode
		});
	};
	const run = async (fn, message) => {
		setBusy(true);
		try {
			const result = await fn();
			toast(result?.message || message);
			setDlg(null);
			load();
		} catch (e) {
			toastError(e);
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
	const create = (e) => {
		e.preventDefault();
		const value = values();
		if (value) run(() => adminCreateGiftCode(value), "Đã thêm mã đổi thưởng");
	};
	const edit = (e) => {
		e.preventDefault();
		const value = values();
		if (!value) return;
		const patch = {};
		if (value.code !== dlg.giftcode.code) patch.code = value.code;
		if (value.coin !== Number(dlg.giftcode.coin)) patch.coin = value.coin;
		const oldDate = dlg.giftcode.date ? new Date(dlg.giftcode.date).toISOString() : null;
		if (value.date !== oldDate) patch.date = value.date;
		const previousUsers = (dlg.giftcode.users || []).map((user) => String(typeof user === "object" ? user._id ?? user.id : user)).filter(Boolean);
		if (JSON.stringify(selectedUsers) !== JSON.stringify(previousUsers)) patch.users = selectedUsers;
		if (!Object.keys(patch).length) return toast("Chưa có thay đổi nào", "info");
		run(() => adminEditGiftCode(dlg.giftcode.code, patch), "Đã cập nhật mã đổi thưởng");
	};
	const remove = () => run(() => adminDeleteGiftCode(dlg.giftcode.code), "Đã xoá mã đổi thưởng");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-extrabold tracking-tight",
						children: "Mã đổi thưởng"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-mute",
						children: list ? `${list.length.toLocaleString("vi-VN")} mã` : "Đang tải danh sách…"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							onClick: openCreate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { size: 15 }), " Thêm mã đổi thưởng"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Tìm mã đổi thưởng…",
					className: "h-10 w-full rounded-lg border border-line bg-panel px-3 text-base outline-none placeholder:text-mute/50 focus:border-lime sm:text-sm"
				}),
				!list && loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					"aria-busy": "true",
					className: "divide-y divide-line rounded-2xl border border-line bg-panel",
					children: Array.from({ length: Math.min(size, 10) }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowSkeleton, {
						w: i % 2 ? "w-1/3" : "w-1/4",
						trail: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "hidden h-3.5 w-14 sm:block" })
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagerSkeleton, {})] }) : !list && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					message: error,
					onRetry: load,
					loading
				}) : shown?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: `divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${loading ? "opacity-50" : ""}`,
					children: rows.map((giftcode, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftCodeRow, {
						giftcode,
						onEdit: () => openEdit(giftcode),
						onDelete: () => setDlg({
							kind: "delete",
							giftcode
						})
					}, `${giftcode.code || "giftcode"}-${index}`))
				}) : null,
				pager,
				list && !shown?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute",
					children: q ? "Không tìm thấy mã đổi thưởng phù hợp" : "Chưa có mã đổi thưởng nào"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftCodeDialog, {
			dlg,
			form,
			setForm,
			busy,
			onClose: close,
			onCreate: create,
			onEdit: edit,
			users,
			usersLoading,
			selectedUsers,
			setSelectedUsers
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteDialog, {
			giftcode: dlg?.kind === "delete" ? dlg.giftcode : null,
			busy,
			onClose: close,
			onConfirm: remove
		})
	] });
}
export { GiftCodes as default };
