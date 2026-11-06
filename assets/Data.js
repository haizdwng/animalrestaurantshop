import { At as useNavigate, Ct as IconDeviceFloppy, D as adminSaveData, Mt as require_react, Nt as __toESM, Q as Coin, X as normShop, Z as parseShopData, _t as Field, at as ErrorState, ct as Tabs, et as JsonEditor, ft as Menu, gt as toastError, ht as toast, i as formatNumber, it as Skeleton, jt as useParams, ot as Spinner, p as adminData, pt as Dialog, vt as Button, xt as IconRefresh, yt as require_jsx_runtime } from "./index.js";
import { r as DATA_TABS } from "./config.js";
import { t as Head } from "./Head.js";
import { t as IconPencil } from "./IconPencil.js";
import { t as IconPlus } from "./IconPlus.js";
import { t as IconTrash } from "./IconTrash.js";
import { t as Tile } from "./Tile.js";
// src/features/administration/ShopEditor.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_FORM = {
	id: "",
	name: "",
	price: "0"
};
var shopData = (value) => (value || []).reduce((result, category) => ({
	...result,
	[category.id]: category.products
}), {});
function ShopEditorSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-busy": "true",
		"aria-label": "Đang tải dữ liệu cửa hàng",
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-8 shrink-0 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 min-w-0 flex-1 rounded-lg sm:w-32 sm:flex-none" })]
		}), Array.from({ length: 3 }).map((_, sectionIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "min-w-0 rounded-2xl border border-line bg-panel p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex min-w-0 items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-28" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-2.5 w-20" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-16 rounded-lg" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3",
				children: Array.from({ length: 3 }).map((_, cardIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-line bg-panel p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-12 shrink-0 rounded-xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-2.5 w-1/2" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 flex-col items-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-7 rounded-lg" })]
						})
					]
				}, cardIndex))
			})]
		}, sectionIndex))]
	});
}
function ProductCard({ product, onEdit, onDelete, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-line bg-panel p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { p: product }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "line-clamp-2 text-[13px] font-bold",
					children: product.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 truncate text-[10px] text-mute",
					children: product.id
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex max-w-full items-center gap-1 text-xs font-bold tabular-nums text-coin",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coin, { size: 14 }),
						" ",
						formatNumber(product.price)
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
					items: [{
						label: "Sửa",
						Icon: IconPencil,
						onClick: onEdit,
						hidden: disabled
					}, {
						label: "Xóa",
						Icon: IconTrash,
						danger: true,
						onClick: onDelete,
						hidden: disabled
					}],
					label: `Tùy chọn ${product.name}`
				})]
			})
		]
	});
}
function ProductDialog({ category, form, setForm, onClose, onSubmit, editing, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!category,
		title: editing ? "Sửa vật phẩm" : "Thêm vật phẩm",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mã vật phẩm",
					value: form.id,
					disabled,
					required: true,
					onChange: (e) => setForm((f) => ({
						...f,
						id: e.target.value
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tên vật phẩm",
					value: form.name,
					disabled,
					required: true,
					onChange: (e) => setForm((f) => ({
						...f,
						name: e.target.value
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Giá",
					type: "number",
					min: "0",
					step: "1",
					value: form.price,
					disabled,
					required: true,
					onChange: (e) => setForm((f) => ({
						...f,
						price: e.target.value
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled,
					children: editing ? "Cập nhật vật phẩm" : "Thêm vật phẩm"
				})
			]
		})
	});
}
function ShopEditor() {
	const [shop, setShop] = (0, import_react.useState)(null);
	const [original, setOriginal] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [dialog, setDialog] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY_FORM);
	const busy = loading || saving;
	const load = async () => {
		if (saving) return;
		setLoading(true);
		setError("");
		setDialog(null);
		try {
			const raw = parseShopData((await adminData("shop")).shop);
			setOriginal(raw);
			setShop(normShop(raw));
		} catch (e) {
			setError(e.message || "Không tải được dữ liệu cửa hàng");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const openAdd = (category) => {
		if (busy) return;
		setForm({
			id: `${category.id}_${category.products.length + 1}`,
			name: `${category.id.charAt(0).toUpperCase() + category.id.slice(1)} ${category.products.length + 1}`,
			price: 0
		});
		setDialog({
			category: category.id,
			product: null
		});
	};
	const openEdit = (category, product) => {
		if (busy) return;
		setForm({
			id: product.id,
			name: product.name,
			price: String(product.price ?? 0)
		});
		setDialog({
			category: category.id,
			product
		});
	};
	const close = () => setDialog(null);
	const closeDelete = () => !saving && setDeleteTarget(null);
	const submit = (event) => {
		event.preventDefault();
		if (busy || !dialog) return;
		const id = form.id.trim();
		const name = form.name.trim();
		const price = Number(form.price);
		if (!id || !name || !Number.isFinite(price) || price < 0) {
			toast("Nhập đầy đủ mã, tên và giá hợp lệ", "err");
			return;
		}
		if (shop.find((category) => category.id === dialog.category)?.products.some((item) => item.id === id && item !== dialog.product)) {
			toast("Mã vật phẩm đã tồn tại trong danh mục này", "err");
			return;
		}
		setShop((current) => current.map((category) => {
			if (category.id !== dialog.category) return category;
			const product = {
				...dialog.product || {},
				id,
				name,
				price
			};
			const products = dialog.product ? category.products.map((item) => item.id === dialog.product.id ? product : item) : [...category.products, product];
			return {
				...category,
				products
			};
		}));
		close();
	};
	const remove = () => {
		if (busy || !deleteTarget) return;
		setShop((current) => current.map((category) => category.id === deleteTarget.category ? {
			...category,
			products: category.products.filter((item) => item !== deleteTarget.product)
		} : category));
		setDeleteTarget(null);
	};
	const payload = (0, import_react.useMemo)(() => {
		if (!shop) return null;
		return {
			...original || {},
			...shopData(shop)
		};
	}, [shop, original]);
	const dirty = (0, import_react.useMemo)(() => {
		if (!shop || !original) return false;
		return JSON.stringify(shopData(shop)) !== JSON.stringify(shopData(normShop(original)));
	}, [shop, original]);
	const save = async () => {
		if (busy || !payload || !dirty) return;
		setSaving(true);
		try {
			const result = await adminSaveData("shop", payload);
			toast(result?.message || "Đã lưu dữ liệu cửa hàng");
			setOriginal(payload);
		} catch (e) {
			toastError(e);
		} finally {
			setSaving(false);
		}
	};
	(0, import_react.useEffect)(() => {
		const onKeyDown = (event) => {
			if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
				event.preventDefault();
				if (!busy && dirty) save();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [
		busy,
		dirty,
		payload
	]);
	if (loading && !shop) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopEditorSkeleton, {});
	if (error && !shop) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: error,
		onRetry: load,
		loading
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"aria-busy": loading || saving,
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					className: "size-8! p-0!",
					onClick: load,
					disabled: loading || saving,
					"aria-label": "Làm mới",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 14 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					className: "min-w-0 flex-1 sm:w-auto sm:flex-none",
					loading: saving,
					disabled: busy || !dirty,
					onClick: save,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconDeviceFloppy, { size: 15 }), " Lưu thay đổi"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `space-y-4 transition-opacity ${loading ? "opacity-60" : ""}`,
				children: shop.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0 rounded-2xl border border-line bg-panel p-4 sm:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-extrabold",
							children: category.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-[11px] text-mute",
							children: [category.products.length, " vật phẩm"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							className: "w-full min-[380px]:w-auto",
							onClick: () => openAdd(category),
							disabled: busy,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { size: 15 }), " Thêm"]
						})]
					}), category.products.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3",
						children: category.products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product,
							disabled: busy,
							onEdit: () => openEdit(category, product),
							onDelete: () => setDeleteTarget({
								category: category.id,
								product
							})
						}, product.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl border border-dashed border-line p-6 text-center text-xs text-mute",
						children: "Chưa có vật phẩm nào"
					})]
				}, category.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
			category: dialog,
			form,
			setForm,
			onClose: close,
			onSubmit: submit,
			editing: !!dialog?.product,
			disabled: busy
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open: !!deleteTarget,
			title: "Xóa vật phẩm",
			onClose: closeDelete,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-mute",
				children: [
					"Xóa vật phẩm ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: "text-fg",
						children: deleteTarget?.product?.name
					}),
					"? Hành động này không thể hoàn tác."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: closeDelete,
					children: "Hủy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					loading: saving,
					disabled: busy,
					onClick: remove,
					children: "Xóa"
				})]
			})]
		})
	] });
}
// src/features/administration/Data.jsx
function AdminData() {
	const { section } = useParams();
	const navigate = useNavigate();
	const activeSection = DATA_TABS.some(([key]) => key === section) ? section : "shop";
	(0, import_react.useEffect)(() => {
		if (!section || activeSection !== section) navigate("/administrator/data/musicians", { replace: true });
	}, [
		section,
		activeSection,
		navigate
	]);
	const visit = (next) => navigate(`/administrator/data/${next}`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
			title: "Dữ liệu",
			sub: "Chỉnh sửa cấu hình · Ctrl/⌘ + S để lưu",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
				tabs: DATA_TABS,
				value: activeSection,
				onChange: visit
			})
		}), activeSection === "shop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopEditor, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonEditor, {
			deps: [activeSection],
			load: async () => (await adminData(activeSection))[activeSection],
			save: (value) => adminSaveData(activeSection, value)
		}, activeSection)]
	});
}
export { AdminData as default };
