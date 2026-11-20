import { $ as adminRecord, At as PagerSkeleton, Bt as Menu, Ct as fileToAvatar, Dt as SearchInput, F as adminAddPlayerFriend, Gt as Field, I as adminAddPlayerLike, It as Tabs, J as adminEncryptRecordValue, Jt as IconSearch, K as adminEditPlayer, Kt as Button, L as adminAddPlayerStar, Lt as PageSizeSelect, Mt as Skeleton, Nt as ErrorState, Ot as JsonEditor, Pt as Spinner, Q as adminPlayers, Rt as Select, U as adminDeletePlayerFriend, Ut as toast, V as adminDecryptRecordValue, Vt as Dialog, Wt as toastError, X as adminPlayer, Xt as IconInfoCircle, Yt as IconRefresh, Z as adminPlayerFriends, an as useNavigate, cn as require_react, en as createReactComponent, j as formatNumber, jt as RowSkeleton, kt as Line, ln as __toESM, nn as require_jsx_runtime, nt as adminUpdatePlayerAvatar, on as useParams, tt as adminSaveRecord } from "./index.js";
import { n as IconArrowLeft, t as IconArrowRight } from "./IconArrowRight.js";
import { o as PLAYER_TABS } from "./config.js";
import { t as IconStarFilled } from "./IconStarFilled.js";
import { t as IconUser } from "./IconUser.js";
import { n as IconLock, r as IconCopy, t as copyText } from "./clipboard.js";
import { t as IconPlus } from "./IconPlus.js";
import { t as IconTrash } from "./IconTrash.js";
import { i as IconStar, t as Tile } from "./Tile.js";
import { t as Head } from "./Head.js";
import { t as usePaginatedData } from "./usePaginatedData.js";
import { n as IconPencil, t as useRemoteResource } from "./useRemoteResource.js";
import { i as validate } from "./validate.js";
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconLockOpen = /* @__PURE__ */ createReactComponent("outline", "lock-open", "LockOpen", [
	["path", {
		"d": "M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -6",
		"key": "svg-0"
	}],
	["path", {
		"d": "M11 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M8 11v-5a4 4 0 0 1 8 0",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconThumbUp = /* @__PURE__ */ createReactComponent("outline", "thumb-up", "ThumbUp", [["path", {
	"d": "M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3",
	"key": "svg-0"
}]]);
/**
* @license @tabler/icons-react v3.52.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconUpload = /* @__PURE__ */ createReactComponent("outline", "upload", "Upload", [
	["path", {
		"d": "M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2",
		"key": "svg-0"
	}],
	["path", {
		"d": "M7 9l5 -5l5 5",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 4l0 12",
		"key": "svg-2"
	}]
]);
// src/features/administration/PlayerCard.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function PlayerCard({ player }) {
	const [imageError, setImageError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setImageError(false), [player.avatarUrl]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "ui-card flex flex-wrap items-center gap-4 p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-raise text-mute",
				children: player.avatarUrl && !imageError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: player.avatarUrl,
					alt: "Ảnh người chơi",
					className: "size-full object-cover",
					onError: () => setImageError(true)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconUser, {
					size: 30,
					stroke: 1.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "wrap-break-word text-lg font-extrabold tracking-tight",
					children: player.nickName || "Chưa đặt tên"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 break-all text-xs text-mute",
					children: player.openid
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "rounded-xl border border-line bg-bg px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-[11px] text-mute",
					children: "Tổng sao"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
					className: "mt-1 flex items-center gap-1.5 text-lg font-extrabold tabular-nums",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconStarFilled, {
							size: 17,
							className: "text-lime"
						}),
						" ",
						Number(player.starSum || 0).toLocaleString("vi-VN")
					]
				})]
			})
		]
	});
}
function PlayerCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-busy": "true",
		className: "ui-card flex flex-wrap items-center gap-4 p-5 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-20 rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					h: "h-7",
					w: "w-40",
					bar: "h-5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					h: "mt-1 h-4",
					w: "w-56 max-w-full",
					bar: "h-2.5"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line bg-bg px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					h: "h-4",
					w: "w-12",
					bar: "h-2"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					h: "mt-1 h-7",
					w: "w-20",
					bar: "h-4"
				})]
			})
		]
	});
}
// src/features/administration/RecordCrypto.jsx
var TYPES = [["v1", "Loại 1"], ["v2", "Loại 2"]];
function RecordCrypto({ openid }) {
	const [mode, setMode] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("v1");
	const [key, setKey] = (0, import_react.useState)("");
	const [numberValue, setNumberValue] = (0, import_react.useState)("");
	const [decryptValue, setDecryptValue] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const run = async (event) => {
		event.preventDefault();
		if (mode === "encrypt") {
			if (numberValue.trim() === "" || !Number.isFinite(Number(numberValue))) return toast("Nhập số nguyên hoặc số thập phân hợp lệ", "err");
			if (type === "v1" && !key.trim()) return toast("Nhập key cho mã hóa v1", "err");
		} else if (!decryptValue.trim()) return toast("Nhập chuỗi cần giải mã", "err");
		setBusy(true);
		try {
			const value = mode === "encrypt" ? await adminEncryptRecordValue(openid, type, Number(numberValue), key.trim()) : await adminDecryptRecordValue(openid, type, decryptValue.trim());
			if (!value.success || (mode === "encrypt" ? typeof value.encrypted !== "string" : typeof value.decrypted !== "number")) return toast(value.message || "Không xử lý được giá trị", "err");
			setResult(mode === "encrypt" ? value.encrypted : String(value.decrypted));
			toast(value.message || "Đã xử lý");
		} catch (error) {
			toastError(error);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "quiet",
			size: "sm",
			className: "w-full",
			onClick: () => {
				setMode("encrypt");
				setResult(null);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLock, { size: 13 }), " Mã hóa"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "quiet",
			size: "sm",
			className: "w-full",
			onClick: () => {
				setMode("decrypt");
				setResult(null);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLockOpen, { size: 13 }), " Giải mã"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!mode,
			title: mode === "encrypt" ? "Mã hóa giá trị" : "Giải mã chuỗi",
			onClose: () => !busy && setMode(""),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit: run,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Loại mã hóa",
						value: type,
						onChange: setType,
						children: TYPES.map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value,
							children: label
						}, value))
					}),
					mode === "encrypt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [type === "v1" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-[11px] font-medium text-mute",
							children: "Khóa mã hóa loại 1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: key,
							onChange: (e) => setKey(e.target.value),
							autoComplete: "off",
							className: "h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-lime"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-[11px] font-medium text-mute",
							children: "Giá trị số"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: numberValue,
							onChange: (e) => setNumberValue(e.target.value),
							inputMode: "decimal",
							className: "h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-lime"
						})]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-[11px] font-medium text-mute",
							children: "Chuỗi đã mã hóa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: decryptValue,
							onChange: (e) => setDecryptValue(e.target.value),
							className: "h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-lime"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						loading: busy,
						children: mode === "encrypt" ? "Mã hóa" : "Giải mã"
					}),
					result !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-lg border border-dashed border-line bg-bg p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "min-w-0 flex-1 break-all text-[11px] text-lime",
							children: result
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-7 shrink-0 place-items-center rounded-md text-mute hover:bg-raise hover:text-fg",
							onClick: () => copyText(result, "Đã sao chép"),
							"aria-label": "Sao chép kết quả",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconCopy, { size: 14 })
						})]
					})
				]
			})
		})
	] });
}
// src/features/administration/PlayerFriends.jsx
var DEFAULT_PAGE_SIZE = 10;
function PlayerFriends({ openid }) {
	const [friends, setFriends] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [pageSize, setPageSize] = (0, import_react.useState)(DEFAULT_PAGE_SIZE);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [friendId, setFriendId] = (0, import_react.useState)("");
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [removeTarget, setRemoveTarget] = (0, import_react.useState)(null);
	const [removing, setRemoving] = (0, import_react.useState)(false);
	const requestId = (0, import_react.useRef)(0);
	const activeOpenid = (0, import_react.useRef)(openid);
	activeOpenid.current = openid;
	const loadFriends = (0, import_react.useCallback)(async () => {
		const request = ++requestId.current;
		setLoading(true);
		setError("");
		try {
			const response = await adminPlayerFriends(openid);
			if (request === requestId.current) setFriends(Array.isArray(response.friends) ? response.friends : []);
		} catch (failure) {
			if (request === requestId.current) setError(failure?.message || "Không thể tải bạn bè");
		} finally {
			if (request === requestId.current) setLoading(false);
		}
	}, [openid]);
	(0, import_react.useEffect)(() => {
		setFriends(null);
		setQuery("");
		setAddOpen(false);
		setRemoveTarget(null);
		loadFriends();
		return () => {
			requestId.current += 1;
		};
	}, [loadFriends]);
	const filtered = (0, import_react.useMemo)(() => (friends || []).filter((friend) => {
		const search = query.trim().toLowerCase();
		return !search || `${friend.nickName || ""} ${friend.openid || ""}`.toLowerCase().includes(search);
	}), [friends, query]);
	const { rows, pager } = usePaginatedData(filtered, pageSize, `${openid}|${query}`);
	const addFriend = async (event) => {
		event.preventDefault();
		const id = friendId.trim();
		if (!id) return;
		if (id === openid) return toast("Không thể thêm chính người chơi này", "err");
		setAdding(true);
		try {
			const response = await adminAddPlayerFriend(openid, id);
			if (activeOpenid.current !== openid) return;
			toast(response.message || "Đã thêm bạn bè");
			setAddOpen(false);
			setFriendId("");
			await loadFriends();
		} catch (failure) {
			toastError(failure);
		} finally {
			setAdding(false);
		}
	};
	const deleteFriend = async () => {
		if (!removeTarget?.openid) return;
		setRemoving(true);
		try {
			const response = await adminDeletePlayerFriend(openid, removeTarget.openid);
			if (activeOpenid.current !== openid) return;
			setFriends((current) => (current || []).filter((friend) => friend.openid !== removeTarget.openid));
			toast(response.message || "Đã xoá bạn bè");
			setRemoveTarget(null);
		} catch (failure) {
			toastError(failure);
		} finally {
			setRemoving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Head, {
				title: "Danh sách bạn bè",
				sub: friends ? `${friends.length.toLocaleString("vi-VN")} bạn bè` : "Đang tải danh sách…",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					className: "size-9! p-0!",
					title: "Tải lại bạn bè",
					"aria-label": "Tải lại bạn bè",
					onClick: loadFriends,
					disabled: loading,
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 17 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					className: "size-9! p-0!",
					title: "Thêm bạn bè",
					"aria-label": "Thêm bạn bè",
					onClick: () => setAddOpen(true),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { size: 18 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchInput, {
					label: "Tìm bạn bè",
					placeholder: "Tìm tên hoặc mã bạn bè…",
					value: query,
					onChange: setQuery
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-32",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSizeSelect, {
						value: pageSize,
						onChange: setPageSize
					})
				})]
			}),
			friends === null && loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"aria-busy": "true",
				className: "divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel",
				children: Array.from({ length: Math.min(pageSize, 10) }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowSkeleton, { kind: "friend" }, index))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagerSkeleton, {})] }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				message: error,
				onRetry: loadFriends,
				loading
			}) : filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: `divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel transition-opacity ${loading ? "opacity-60" : ""}`,
				children: rows.map((friend) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex min-w-0 items-center gap-3 p-3 sm:px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { p: {
							key: friend.openid,
							name: friend.nickName || "Người chơi",
							image: friend.avatarUrl
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-bold",
									children: friend.nickName || "Chưa đặt tên"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 break-all text-[11px] text-mute",
									children: friend.openid
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 flex items-center gap-1 text-[11px] font-semibold text-lime",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconStarFilled, { size: 12 }),
										" ",
										formatNumber(Number(friend.starSum || 0)),
										" sao"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							size: "sm",
							className: "size-9! shrink-0 p-0! text-bad! hover:bg-bad/10",
							onClick: () => setRemoveTarget(friend),
							title: `Xóa bạn bè ${friend.nickName || friend.openid}`,
							"aria-label": `Xóa ${friend.nickName || friend.openid} khỏi danh sách bạn bè`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconTrash, { size: 17 })
						})
					]
				}, friend.openid))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-line px-5 py-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconUser, {
					size: 25,
					className: "mx-auto text-mute"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs font-bold",
					children: query ? "Không tìm thấy bạn bè phù hợp" : "Chưa có bạn bè"
				})]
			}),
			!error && filtered.length > 0 && pager,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				title: "Thêm bạn bè",
				onClose: () => !adding && setAddOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: addFriend,
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mã bạn bè",
						placeholder: "Nhập mã bạn bè",
						autoFocus: true,
						autoCapitalize: "none",
						value: friendId,
						onChange: (event) => setFriendId(event.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "w-full",
						disabled: !friendId.trim(),
						loading: adding,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPlus, { size: 16 }), " Thêm bạn bè"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: !!removeTarget,
				title: "Xóa bạn bè",
				onClose: () => !removing && setRemoveTarget(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs leading-6 text-mute",
					children: [
						"Bạn có chắc muốn xóa ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-fg",
							children: removeTarget?.nickName || removeTarget?.openid
						}),
						" khỏi danh sách bạn bè?"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setRemoveTarget(null),
						disabled: removing,
						children: "Hủy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: deleteFriend,
						loading: removing,
						children: "Xóa bạn bè"
					})]
				})]
			})
		]
	});
}
// src/features/administration/PlayerRow.jsx
function PlayerRow({ player, onAction }) {
	const p = player;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "size-10 shrink-0 overflow-hidden rounded-xl bg-raise",
				children: p.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.avatarUrl,
					alt: "",
					className: "size-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-full place-items-center text-sm font-extrabold text-lime",
					children: (p.nickName || "?")[0]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-bold",
					children: p.nickName || "Chưa đặt tên"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 truncate text-[11px] text-mute",
					children: p.openid || "Không có mã người chơi"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden min-w-0 shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-bold tabular-nums text-lime sm:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconStarFilled, {
						size: 14,
						className: "shrink-0"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: Number(p.starSum || 0).toLocaleString("vi-VN")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { items: [
				{
					label: "Sửa",
					Icon: IconPencil,
					onClick: () => onAction("edit")
				},
				{
					label: "Thêm sao",
					Icon: IconStar,
					onClick: () => onAction("star")
				},
				{
					label: "Thêm lượt thích",
					Icon: IconThumbUp,
					onClick: () => onAction("like")
				},
				{
					label: "Xem thông tin",
					Icon: IconInfoCircle,
					onClick: () => onAction("info")
				}
			] })
		]
	});
}
function PlayerRowSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		"aria-hidden": "true",
		className: "flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-10 shrink-0 rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-2/5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-2.5 w-3/5" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden items-center gap-1.5 sm:flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-3.5 shrink-0 rounded-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-14" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "size-9 shrink-0 rounded-lg" })
		]
	});
}
// src/features/administration/PlayerDialogs.jsx
function PlayerDialogs({ player, open, busy, onClose, onSave }) {
	const [nickName, setNickName] = (0, import_react.useState)("");
	const [preview, setPreview] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => () => preview?.url && URL.revokeObjectURL(preview.url), [preview]);
	(0, import_react.useEffect)(() => {
		if (open === "edit") {
			setNickName(player?.nickName || "");
			setPreview("");
		}
	}, [open, player]);
	const pickFile = async (event) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;
		try {
			const original = fileToAvatar(file);
			setPreview({
				file: original,
				url: URL.createObjectURL(original)
			});
		} catch (error) {
			toast(error.message, "err");
		}
	};
	const submitName = (event) => {
		event.preventDefault();
		const error = validate.playerName(nickName);
		if (error) return toast(error, "err");
		onSave({
			nickName: nickName.trim(),
			avatar: preview?.file
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: open === "edit",
		title: `Sửa ${player?.nickName || "người chơi"}`,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			noValidate: true,
			className: "space-y-4",
			onSubmit: submitName,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mx-auto grid aspect-square w-full max-w-48 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-line bg-bg hover:border-lime",
					children: [preview?.url || player?.avatarUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: preview?.url || player.avatarUrl,
						alt: "Xem trước",
						className: "size-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex flex-col items-center gap-2 text-xs text-mute",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconUpload, { size: 28 }), " Chọn ảnh đại diện"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".jpg,.jpeg,.png",
						className: "hidden",
						onChange: pickFile
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-[11px] text-mute",
					children: preview ? "Bấm vào ảnh để chọn ảnh khác" : "JPG, JPEG, PNG · tối đa 8MB · ảnh gốc được giữ nguyên"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tên người chơi",
					hint: `${nickName.trim().length}/32`,
					maxLength: 32,
					autoFocus: true,
					value: nickName,
					onChange: (event) => setNickName(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					loading: busy,
					children: "Lưu thay đổi"
				})
			]
		})
	});
}
function PlayerStarDialog({ player, open, busy, onClose, onSubmit }) {
	const [value, setValue] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open === "star") setValue("");
	}, [open, player]);
	const submit = (event) => {
		event.preventDefault();
		const star = Number(value);
		if (!Number.isSafeInteger(star) || star < 1) return toast("Số sao phải là số nguyên từ 1 trở lên", "err");
		onSubmit(star);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: open === "star",
		title: `Thêm sao cho ${player?.nickName || "người chơi"}`,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			noValidate: true,
			className: "space-y-4",
			onSubmit: submit,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Số sao",
				hint: "số nguyên ≥ 1",
				inputMode: "numeric",
				placeholder: "1",
				autoFocus: true,
				value,
				onChange: (event) => setValue(event.target.value.replace(/\D/g, "").slice(0, 9))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				loading: busy,
				disabled: !value,
				children: "Thêm sao"
			})]
		})
	});
}
function PlayerLikeDialog({ player, open, busy, onClose, onSubmit }) {
	const [value, setValue] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open === "like") setValue("");
	}, [open, player]);
	const submit = (event) => {
		event.preventDefault();
		const like = Number(value);
		if (!Number.isSafeInteger(like) || like < 1) return toast("Số lượt thích phải là số nguyên từ 1 trở lên", "err");
		onSubmit(like);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: open === "like",
		title: `Thêm lượt thích cho ${player?.nickName || "người chơi"}`,
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			noValidate: true,
			className: "space-y-4",
			onSubmit: submit,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Số lượt thích",
				hint: "số nguyên ≥ 1",
				inputMode: "numeric",
				placeholder: "1",
				autoFocus: true,
				value,
				onChange: (event) => setValue(event.target.value.replace(/\D/g, "").slice(0, 9))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				loading: busy,
				disabled: !value,
				children: "Thêm lượt thích"
			})]
		})
	});
}
// src/features/administration/Players.jsx
var PLAYER_SECTIONS = PLAYER_TABS.map(([key]) => key);
function AdminPlayers() {
	const navigate = useNavigate();
	const { openid, section } = useParams();
	const { data: list, setData, loading: listLoading, error: listError, reload } = useRemoteResource(async () => (await adminPlayers()).players, !openid);
	const [input, setInput] = (0, import_react.useState)(openid || "");
	const [player, setPlayer] = (0, import_react.useState)({
		data: null,
		loading: false,
		error: ""
	});
	const [query, setQuery] = (0, import_react.useState)("");
	const [dialog, setDialog] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [manualOpen, setManualOpen] = (0, import_react.useState)(false);
	const [size, setSize] = (0, import_react.useState)(10);
	const currentSection = PLAYER_SECTIONS.includes(section) ? section : "player";
	const shown = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return (list || []).filter((person) => !needle || [person.nickName, person.openid].some((value) => String(value || "").toLowerCase().includes(needle)));
	}, [list, query]);
	const { rows, pager } = usePaginatedData(shown, size, query);
	const loadPlayer = (0, import_react.useCallback)(async (id) => {
		if (!id) return;
		setPlayer({
			data: null,
			loading: true,
			error: ""
		});
		try {
			const response = await adminPlayer(id);
			setPlayer({
				data: response.player ?? response,
				loading: false,
				error: ""
			});
		} catch (error) {
			setPlayer({
				data: null,
				loading: false,
				error: error.message
			});
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (!openid) {
			setPlayer({
				data: null,
				loading: false,
				error: ""
			});
			setInput("");
			return;
		}
		setInput(openid);
		if (section === "player") {
			loadPlayer(openid);
			return;
		}
		setPlayer({
			data: null,
			loading: false,
			error: ""
		});
	}, [
		openid,
		section,
		loadPlayer
	]);
	(0, import_react.useEffect)(() => {
		if (!openid || PLAYER_SECTIONS.includes(section)) return;
		navigate(`/administrator/players/${encodeURIComponent(openid)}/player`, { replace: true });
	}, [
		openid,
		section,
		navigate
	]);
	const openPlayer = (id) => {
		const value = String(id || "").trim();
		if (!value) return;
		setInput(value);
		navigate(`/administrator/players/${encodeURIComponent(value)}/player`);
	};
	const go = (event) => {
		event.preventDefault();
		openPlayer(input);
	};
	const addStar = async (star) => {
		if (!dialog?.player) return;
		const id = dialog.player.openid;
		setBusy(true);
		try {
			const response = await adminAddPlayerStar(id, star);
			const add = (person) => ({
				...person,
				starSum: Number(person.starSum || 0) + star
			});
			setData((items) => (items || []).map((item) => item.openid === id ? add(item) : item));
			if (openid === id) setPlayer((current) => ({
				...current,
				data: current.data && add(current.data)
			}));
			toast(response.message || `Đã thêm ${star} sao`);
			setDialog(null);
		} catch (error) {
			toastError(error);
		} finally {
			setBusy(false);
		}
	};
	const addLike = async (like) => {
		if (!dialog?.player) return;
		const id = dialog.player.openid;
		setBusy(true);
		try {
			const response = await adminAddPlayerLike(id, like);
			toast(response.message || `Đã thêm ${like} lượt thích`);
			setDialog(null);
		} catch (error) {
			toastError(error);
		} finally {
			setBusy(false);
		}
	};
	const savePlayer = async ({ nickName, avatar }) => {
		if (!dialog?.player) return;
		const id = dialog.player.openid;
		if (!nickName && !avatar) {
			toast("Chưa có thay đổi nào", "info");
			return;
		}
		setBusy(true);
		try {
			if (nickName && nickName !== dialog.player.nickName) await adminEditPlayer(id, { nickName });
			if (avatar) await adminUpdatePlayerAvatar(id, avatar);
			const patch = {
				...nickName ? { nickName } : {},
				...avatar ? { avatarUrl: avatar } : {}
			};
			setData((items) => (items || []).map((item) => item.openid === id ? {
				...item,
				...patch
			} : item));
			if (openid === id) setPlayer((current) => ({
				...current,
				data: {
					...current.data,
					...patch
				}
			}));
			toast("Đã cập nhật người chơi");
			setDialog(null);
		} catch (error) {
			toastError(error);
		} finally {
			setBusy(false);
		}
	};
	const selectSection = (next) => {
		if (openid && PLAYER_SECTIONS.includes(next)) navigate(`/administrator/players/${encodeURIComponent(openid)}/${next}`);
	};
	if (!openid) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
				title: "Người chơi",
				sub: list ? `${list.length.toLocaleString("vi-VN")} người chơi` : "Đang tải danh sách…",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "size-8! p-0!",
						onClick: reload,
						disabled: listLoading,
						"aria-label": "Làm mới",
						children: listLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { size: 14 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRefresh, { size: 14 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setManualOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSearch, { size: 14 }), " Mã người chơi"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-[1fr_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex h-10 items-center gap-2 rounded-lg border border-line bg-panel px-3 focus-within:border-lime",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSearch, {
						size: 15,
						className: "text-mute"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Tìm tên người chơi, mã người chơi…",
						className: "min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-mute/50 sm:text-sm"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSizeSelect, {
					value: size,
					onChange: setSize
				})]
			}),
			!list && listLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				"aria-busy": "true",
				className: "divide-y divide-line rounded-2xl border border-line bg-panel",
				children: Array.from({ length: Math.min(size, 10) }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerRowSkeleton, {}, index))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagerSkeleton, {})] }) : !list && listError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				message: listError,
				onRetry: reload,
				loading: listLoading
			}) : shown.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: `divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${listLoading ? "opacity-50" : ""}`,
				children: rows.map((person, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerRow, {
					player: person,
					onAction: (kind) => kind === "info" ? openPlayer(person.openid) : setDialog({
						kind,
						player: person
					})
				}, `${person.openid || "player"}-${index}`))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute",
				children: query ? "Không tìm thấy người chơi phù hợp" : "Chưa có người chơi nào"
			}),
			pager,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: manualOpen,
				title: "Xem thông tin theo mã người chơi",
				onClose: () => setManualOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (event) => {
						go(event);
						setManualOpen(false);
					},
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mã người chơi",
						placeholder: "openid",
						autoFocus: true,
						autoCapitalize: "none",
						value: input,
						onChange: (event) => setInput(event.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "w-full",
						disabled: !input.trim(),
						children: ["Xem thông tin ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 15 })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerDialogs, {
				player: dialog?.player,
				open: dialog?.kind,
				busy,
				onClose: () => !busy && setDialog(null),
				onSave: savePlayer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerStarDialog, {
				player: dialog?.player,
				open: dialog?.kind,
				busy,
				onClose: () => !busy && setDialog(null),
				onSubmit: addStar
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerLikeDialog, {
				player: dialog?.player,
				open: dialog?.kind,
				busy,
				onClose: () => !busy && setDialog(null),
				onSubmit: addLike
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "size-8! shrink-0 p-0!",
						onClick: () => navigate("/administrator/players"),
						"aria-label": "Quay lại danh sách người chơi",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconArrowLeft, { size: 14 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: go,
						className: "flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-panel px-3 focus-within:border-lime",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSearch, {
							size: 14,
							className: "text-mute"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: input,
							onChange: (event) => setInput(event.target.value),
							placeholder: "Mã người chơi khác…",
							className: "min-w-0 flex-1 bg-transparent text-base outline-none sm:text-xs"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
					value: currentSection,
					onChange: selectSection,
					tabs: PLAYER_TABS
				})]
			}),
			currentSection === "player" && (player.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCardSkeleton, {}) : player.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				message: player.error,
				onRetry: () => loadPlayer(openid)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerCard, { player: player.data || { openid } })),
			currentSection === "friends" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerFriends, { openid }),
			currentSection === "record" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-1 rounded-lg border border-line bg-panel p-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordCrypto, { openid })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonEditor, {
					deps: [openid],
					load: async () => (await adminRecord(openid)).record,
					save: (value) => adminSaveRecord(openid, value)
				}, openid)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerDialogs, {
				player: dialog?.player,
				open: dialog?.kind,
				busy,
				onClose: () => !busy && setDialog(null),
				onSave: savePlayer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerStarDialog, {
				player: dialog?.player,
				open: dialog?.kind,
				busy,
				onClose: () => !busy && setDialog(null),
				onSubmit: addStar
			})
		]
	});
}
export { AdminPlayers as default };
