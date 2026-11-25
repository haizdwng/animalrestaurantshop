import { At as require_jsx_runtime, It as require_react, Lt as __toESM, Ot as createReactComponent } from "./index.js";
/**
* @license @tabler/icons-react v3.53.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconStar = /* @__PURE__ */ createReactComponent("outline", "star", "Star", [["path", {
	"d": "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245",
	"key": "svg-0"
}]]);
// src/features/shop/cartUtils.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
var own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
var finiteCap = (value) => value == null ? Infinity : Number.isSafeInteger(value) && value >= 0 ? value : 0;
var nodeType = (node) => node?.type ?? "default";
var nodeOptions = (node) => object(node?.options) ? Object.values(node.options) : [];
var hasOptions = (node) => nodeType(node) !== "default";
var hasValidPrice = (node) => Number.isSafeInteger(node?.price) && node.price >= 0;
var ownedValue = (owned) => {
	if (typeof owned === "boolean") return owned;
	if (typeof owned === "number") return Number.isFinite(owned) ? owned > 0 : null;
	if (typeof owned === "string") return owned.trim().length > 0;
	return null;
};
var ownedLabel = (node) => {
	if (!node || !own(node, "owned") || node.owned == null) return "";
	const owned = node.owned;
	if (typeof owned === "boolean") return owned ? "Đã sở hữu" : "Chưa sở hữu";
	if (typeof owned === "number") return `Đang có ${owned.toLocaleString("vi-VN")}`;
	if (typeof owned === "string") return owned ? `Đang có: ${owned}` : "";
	return "";
};
var effectiveDisplay = (node, ancestors = []) => {
	const result = {};
	for (const parent of [...ancestors, node]) for (const key of [
		"image",
		"description",
		"unit"
	]) if (own(parent, key)) result[key] = parent[key];
	return result;
};
var canonicalSelections = (value, depth = 0) => {
	if (!object(value) || depth > 62) throw new Error("Cây lựa chọn không hợp lệ");
	return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalSelections(value[key], depth + 1)]));
};
var cartLineId = ({ category, key, selections }) => JSON.stringify([
	category,
	key,
	canonicalSelections(selections)
]);
var createCartLine = (category, key, amount, selections) => ({
	category,
	key,
	amount,
	selections: canonicalSelections(selections)
});
var cartCount = (entries) => entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
var cartTotal = (entries) => entries.reduce((sum, entry) => sum + (entry.subtotal || 0), 0);
var clampCartQuantity = (quantity, max = 100) => {
	const parsed = Number(quantity);
	return Math.max(1, Math.min(Number.isFinite(parsed) ? Math.trunc(parsed) : 1, Math.max(1, Number.isFinite(max) ? Math.floor(max) : 1e5)));
};
var catalogProduct = (tabs, category, key) => tabs?.find((tab) => tab.id === category)?.products?.find((node) => node.key === key) || null;
var nodeCanPurchase = (node, now) => node?.canPurchase !== false && (!Array.isArray(node?.conditions) || node.conditions.every(({ met }) => met === true)) && (node.startTime == null || now >= node.startTime) && (node.endTime == null || now < node.endTime) && node.limit == null && node.remainingLimit == null && (node.remainingCapacity == null || finiteCap(node.remainingCapacity) > 0) && (node.maxPurchasableQuantity == null || finiteCap(node.maxPurchasableQuantity) > 0) && (node.purchaseLimit == null || finiteCap(node.purchaseLimit) > 0);
function initialSelections(node, insideGrouped = false, now = Date.now(), depth = 0) {
	if (!object(node) || depth > 62) return {};
	const type = nodeType(node);
	const options = Object.entries(node.options || {}).filter(([, child]) => object(child));
	if (type === "default" || options.length === 0) return {};
	const preference = node.defaultValue;
	const preferredKeys = Array.isArray(preference) ? preference : typeof preference === "string" ? [preference] : object(preference) ? Object.keys(preference) : [];
	const sorted = [...options].sort(([a, x], [b, y]) => Number(preferredKeys.includes(b)) - Number(preferredKeys.includes(a)) || Number(nodeCanPurchase(y, now)) - Number(nodeCanPurchase(x, now)));
	const value = {};
	if (type === "grouped") {
		for (const [key, child] of options) if (child.required !== false || preferredKeys.includes(key)) value[key] = object(preference) && object(preference[key]) ? canonicalSelections(preference[key]) : initialSelections(child, true, now, depth + 1);
	} else if (type === "single" || type === "multiple" && !insideGrouped) {
		const [key, child] = sorted[0];
		value[key] = object(preference) && object(preference[key]) ? canonicalSelections(preference[key]) : initialSelections(child, insideGrouped, now, depth + 1);
	} else if (type === "multiple") {
		const min = node.minSelections ?? 0;
		for (const [key, child] of sorted) {
			if (!preferredKeys.includes(key) && Object.keys(value).length >= min) continue;
			value[key] = object(preference) && object(preference[key]) ? canonicalSelections(preference[key]) : initialSelections(child, true, now, depth + 1);
		}
	}
	if (type === "grouped") {
		const min = node.minSelections ?? 1;
		for (const [key, child] of sorted) {
			if (Object.keys(value).length >= min) break;
			if (!own(value, key)) value[key] = initialSelections(child, true, now, depth + 1);
		}
	}
	return value;
}
function visitNode(node, selections, ctx, path, inherited = {}, insideGrouped = false, depth = 0) {
	if (!object(node) || !object(selections) || depth > 62) throw new Error("Cây lựa chọn không hợp lệ");
	if (node.canPurchase === false) throw new Error(`${node.name || node.key}: Chưa được phép mua`);
	if (Array.isArray(node.conditions) && node.conditions.some((item) => item?.met !== true)) throw new Error(`${node.name || node.key}: Chưa đạt điều kiện mua`);
	if (node.startTime != null && (!Number.isSafeInteger(node.startTime) || ctx.now < node.startTime)) throw new Error(`${node.name || node.key}: Chưa đến thời gian mở bán`);
	if (node.endTime != null && (!Number.isSafeInteger(node.endTime) || ctx.now >= node.endTime)) throw new Error(`${node.name || node.key}: Đã hết thời gian bán`);
	if (node.limit != null || node.remainingLimit != null) throw new Error(`${node.name || node.key}: Giới hạn lịch sử chưa được hỗ trợ`);
	const id = JSON.stringify(path);
	const scope = node.purchaseLimitScope ?? inherited.scope ?? "shared";
	if (!["shared", "individual"].includes(scope)) throw new Error("Phạm vi giới hạn không hợp lệ");
	let individualLimit = inherited.individualLimit ?? null;
	if (own(node, "purchaseLimit")) {
		if (scope === "shared") ctx.constraints.push({
			id: `purchase:${id}`,
			cap: finiteCap(node.purchaseLimit)
		});
		else individualLimit = node.purchaseLimit;
	}
	if (node.remainingCapacity != null) ctx.constraints.push({
		id: `capacity:${id}`,
		cap: finiteCap(node.remainingCapacity)
	});
	if (node.maxPurchasableQuantity != null) ctx.constraints.push({
		id: `maximum:${id}`,
		cap: finiteCap(node.maxPurchasableQuantity)
	});
	const type = nodeType(node);
	const options = node.options ?? {};
	if (!object(options)) throw new Error("Options phải là object");
	const selectedKeys = Object.keys(selections);
	const price = node.price === void 0 ? inherited.price ?? 0 : node.price;
	if (!Number.isSafeInteger(price) || price < 0) throw new Error("Giá vật phẩm không hợp lệ");
	const childState = {
		scope,
		individualLimit,
		price: type === "grouped" ? 0 : price
	};
	let childPrice = 0;
	let leafCount = 0;
	if (type === "default") {
		if (selectedKeys.length || Object.keys(options).length) throw new Error("Sản phẩm mặc định không có lựa chọn");
		leafCount = 1;
		ctx.labels.push(node.name || node.key);
	} else if ([
		"single",
		"multiple",
		"grouped"
	].includes(type)) {
		if (type === "single" && selectedKeys.length !== 1) throw new Error(`${node.name || node.key}: Phải chọn đúng một lựa chọn`);
		if (type === "multiple" && !insideGrouped && selectedKeys.length !== 1) throw new Error(`${node.name || node.key}: Mỗi dòng chỉ được chọn một nhánh`);
		const minimum = node.minSelections ?? (type === "multiple" && insideGrouped ? 0 : 1);
		const maximum = node.maxSelections ?? Object.keys(options).length;
		if (selectedKeys.length < minimum || selectedKeys.length > maximum) throw new Error(`${node.name || node.key}: Số lựa chọn không hợp lệ`);
		if (type === "grouped" && Object.entries(options).some(([key, child]) => child.required !== false && !own(selections, key))) throw new Error(`${node.name || node.key}: Thiếu nhóm bắt buộc`);
		if (type === "single" && !insideGrouped) ctx.singleChoices.push({
			id,
			choice: selectedKeys[0]
		});
		for (const key of selectedKeys) {
			if (!own(options, key) || options[key]?.key !== key) throw new Error("Lựa chọn không thuộc sản phẩm");
			const child = visitNode(options[key], selections[key], ctx, [...path, key], childState, insideGrouped || type === "grouped", depth + 1);
			childPrice += child.price;
			leafCount += child.leafCount;
			if (!Number.isSafeInteger(childPrice)) throw new Error("Giá vật phẩm vượt giới hạn");
		}
	} else throw new Error("Kiểu sản phẩm không hợp lệ");
	const effectivePrice = type === "default" ? price : type === "grouped" ? price + childPrice : childPrice;
	if (!Number.isSafeInteger(effectivePrice)) throw new Error("Giá sản phẩm vượt giới hạn");
	if (!insideGrouped && (type === "default" || type === "grouped") && individualLimit != null) ctx.constraints.push({
		id: `individual:${id}`,
		cap: finiteCap(individualLimit)
	});
	return {
		price: effectivePrice,
		leafCount
	};
}
function inspectLine(line, tabs, accountLimit, now) {
	const result = {
		...line,
		lineId: "",
		node: null,
		invalid: "",
		constraints: [],
		singleChoices: [],
		labels: [],
		unitPrice: 0,
		subtotal: 0,
		max: accountLimit
	};
	try {
		if (!object(line) || typeof line.category !== "string" || typeof line.key !== "string" || !Number.isSafeInteger(line.amount) || line.amount < 1 || line.amount > accountLimit) throw new Error("Số lượng mua không hợp lệ");
		result.lineId = cartLineId(line);
		const node = catalogProduct(tabs, line.category, line.key);
		if (!node) throw new Error("Sản phẩm không còn được bán");
		result.node = node;
		const context = {
			now,
			constraints: [],
			labels: [],
			singleChoices: []
		};
		const resolution = visitNode(node, line.selections, context, [line.category, line.key]);
		result.constraints = context.constraints;
		result.singleChoices = context.singleChoices;
		result.labels = context.labels;
		result.unitPrice = resolution.price;
		result.subtotal = resolution.price * line.amount;
		if (!Number.isSafeInteger(result.subtotal)) throw new Error("Thành tiền vượt giới hạn");
		result.max = Math.min(accountLimit, ...context.constraints.map(({ cap }) => cap));
		if (line.amount > result.max) throw new Error("Vượt giới hạn mua của sản phẩm");
	} catch (error) {
		result.invalid = error.message || "Dữ liệu sản phẩm không hợp lệ";
	}
	return result;
}
function resolveCart(cart, tabs, accountLimit = 100, now = Date.now()) {
	const rows = (cart || []).map((line) => inspectLine(line, tabs, accountLimit, now));
	const usage = /* @__PURE__ */ new Map();
	const seen = /* @__PURE__ */ new Set();
	const singles = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (row.invalid) continue;
		if (seen.has(row.lineId)) row.invalid = "Dòng sản phẩm trùng lặp";
		seen.add(row.lineId);
		for (const constraint of row.constraints) {
			if (!usage.has(constraint.id)) usage.set(constraint.id, {
				cap: constraint.cap,
				amount: 0
			});
			usage.get(constraint.id).amount += row.amount;
		}
		for (const choice of row.singleChoices) {
			if (singles.has(choice.id) && singles.get(choice.id) !== choice.choice) row.invalid = "Nhóm chọn một không được chứa hai lựa chọn khác nhau";
			singles.set(choice.id, choice.choice);
		}
	}
	for (const row of rows) {
		if (row.invalid) continue;
		if (row.constraints.some((constraint) => usage.get(constraint.id)?.amount > constraint.cap)) row.invalid = "Tổng giỏ hàng vượt giới hạn mua hoặc sức chứa";
	}
	const total = cartTotal(rows);
	if (!Number.isSafeInteger(total)) rows.forEach((row) => {
		row.invalid ||= "Tổng tiền vượt giới hạn";
	});
	return rows;
}
function lineMaximum(line, entries, accountLimit = 100) {
	const limits = [accountLimit];
	for (const constraint of line.constraints || []) {
		const others = entries.reduce((sum, row) => sum + (row.lineId !== line.lineId && row.constraints?.some(({ id }) => id === constraint.id) ? row.amount : 0), 0);
		limits.push(constraint.cap - others);
	}
	return Math.max(0, Math.min(...limits));
}
function putInCart(cart, line, tabs, accountLimit = 100, now = Date.now()) {
	const candidate = createCartLine(line.category, line.key, line.amount, line.selections);
	const id = cartLineId(candidate);
	const matching = cart.filter((existing) => cartLineId(existing) === id);
	if (matching.length) {
		candidate.amount += matching.reduce((sum, item) => sum + item.amount, 0);
		if (!Number.isSafeInteger(candidate.amount)) throw new Error("Số lượng cộng dồn vượt giới hạn");
	}
	let updated = cart.filter((existing) => cartLineId(existing) !== id);
	if (nodeType(catalogProduct(tabs, candidate.category, candidate.key)) === "single") updated = updated.filter((existing) => existing.category !== candidate.category || existing.key !== candidate.key);
	updated.push(candidate);
	const result = resolveCart(updated, tabs, accountLimit, now);
	const invalid = result.find((row) => row.invalid);
	if (invalid) throw new Error(invalid.invalid);
	if (result.length > 5e3) throw new Error("Đơn hàng vượt quá 5.000 dòng");
	return updated;
}
var cartPayload = (entries) => entries.map(({ category, key, amount, selections }) => ({
	category,
	key,
	amount,
	selections: canonicalSelections(selections)
}));
var removeCategoryFromCart = (cart, categoryId) => cart.filter((line) => line.category !== categoryId);
var isDirectlyAvailable = (node, now = Date.now()) => nodeType(node) === "default" && nodeCanPurchase(node, now) && (node.price === void 0 || hasValidPrice(node));
function addCategoryToCart(cart, categoryId, products, tabs, limit, now = Date.now()) {
	const existingIds = new Set(cart.map((entry) => cartLineId(entry)));
	const additions = [];
	for (const node of products) {
		if (cart.length + additions.length >= 5e3) break;
		if (!isDirectlyAvailable(node, now)) continue;
		const line = createCartLine(categoryId, node.key, 1, {});
		const id = cartLineId(line);
		if (existingIds.has(id)) continue;
		existingIds.add(id);
		additions.push(line);
	}
	const combined = [...cart, ...additions];
	const invalidNew = new Set(resolveCart(combined, tabs, limit, now).filter((entry) => entry.invalid && !cart.some((old) => cartLineId(old) === entry.lineId)).map((entry) => entry.lineId));
	return combined.filter((entry) => !invalidNew.has(cartLineId(entry)));
}
function isAvailable(node, accountLimit = 100, now = Date.now()) {
	if (!node || !nodeCanPurchase(node, now)) return false;
	if (nodeType(node) === "default") return node.price === void 0 || hasValidPrice(node);
	const selection = initialSelections(node, false, now);
	try {
		const context = {
			now,
			constraints: [],
			labels: [],
			singleChoices: []
		};
		visitNode(node, selection, context, ["preview", node.key]);
		return context.constraints.every(({ cap }) => cap > 0) && accountLimit > 0;
	} catch {
		return false;
	}
}
function findLine(entries, line) {
	const id = cartLineId(line);
	return entries.find((entry) => entry.lineId === id);
}
// src/features/shop/shopUtilities.js
var hasPrice = hasValidPrice;
var initials = (name) => String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
function matches(node, needle) {
	if (!needle) return true;
	if (String(node?.name || "").toLowerCase().includes(needle) || String(node?.key || "").toLowerCase().includes(needle) || String(node?.description || "").toLowerCase().includes(needle)) return true;
	return nodeOptions(node).some((option) => matches(option, needle));
}
// src/features/shop/Tile.jsx
var import_jsx_runtime = require_jsx_runtime();
var usableImage = (value) => typeof value === "string" && /^(https?:\/\/|\/|data:image\/)/i.test(value);
function Tile({ p, size = "md" }) {
	const large = size === "lg";
	const [failed, setFailed] = (0, import_react.useState)("");
	const src = usableImage(p?.image) ? p.image : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-raise text-mute ${large ? "size-16" : "size-12"}`,
		children: src && src !== failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt: "",
			loading: "lazy",
			className: "size-full object-cover",
			onError: () => setFailed(src)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-extrabold tracking-tight ${large ? "text-xl" : "text-sm"}`,
			children: initials(p?.name || p?.key) || "?"
		})
	});
}
export { putInCart as C, IconStar as E, ownedValue as S, resolveCart as T, isDirectlyAvailable as _, cartCount as a, nodeType as b, cartTotal as c, effectiveDisplay as d, findLine as f, isAvailable as g, initialSelections as h, addCategoryToCart as i, clampCartQuantity as l, hasValidPrice as m, hasPrice as n, cartLineId as o, hasOptions as p, matches as r, cartPayload as s, Tile as t, createCartLine as u, lineMaximum as v, removeCategoryFromCart as w, ownedLabel as x, nodeOptions as y };
