import { n as IconArrowLeft, t as IconArrowRight } from "./IconArrowRight.js";
import { i as validate, n as hasErrors, t as cleanOtp } from "./validate.js";
import { B as passwordOtp, Ct as __toESM, H as signup, J as Logo, St as require_react, U as signupOtp, V as resetPassword, bt as IconAlertTriangle, ft as Field, lt as OtpButton, mt as require_jsx_runtime, pt as Button, ut as toast, xt as createReactComponent, z as login } from "./index.js";
import { t as StrengthBar } from "./StrengthBar.js";
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconShieldCheck = createReactComponent("outline", "shield-check", "ShieldCheck", [["path", {
	"d": "M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06",
	"key": "svg-0"
}], ["path", {
	"d": "M15 19l2 2l4 -4",
	"key": "svg-1"
}]]);
// src/features/authentication/config.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var LAST_USER_KEY = "username";
var EMPTY_FORM = {
	username: "",
	password: "",
	confirm: "",
	openid: "",
	otp: ""
};
var MODE_TABS = [["login", "Đăng nhập"], ["register", "Đăng ký"]];
var SUBMIT_LABELS = {
	login: "Đăng nhập",
	register: "Tạo tài khoản",
	forgot: "Đặt lại mật khẩu"
};
// src/features/authentication/AuthHeader.jsx
var import_jsx_runtime = require_jsx_runtime();
function AuthHeader({ mode, onMode }) {
	if (mode === "forgot") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onMode("login"),
				className: "mb-3 flex cursor-pointer items-center gap-1 text-[11px] text-mute hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconArrowLeft, { size: 14 }), " Quay lại đăng nhập"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-extrabold tracking-tight",
				children: "Quên mật khẩu"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-mute",
				children: "Đặt mật khẩu mới bằng mã OTP gửi tới mã người chơi của bạn."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "tablist",
		className: "mb-6 grid grid-cols-2 gap-1 rounded-lg bg-bg p-1",
		children: MODE_TABS.map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			role: "tab",
			type: "button",
			"aria-selected": mode === k,
			onClick: () => mode !== k && onMode(k),
			className: `h-9 cursor-pointer rounded-md text-xs font-bold transition ${mode === k ? "bg-raise text-fg shadow" : "text-mute hover:text-fg"}`,
			children: label
		}, k))
	});
}
// src/features/authentication/AuthLayout.jsx
function AuthLayout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-lime)_10%,transparent),transparent_70%)]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(var(--color-fg)_1px,transparent_1px),linear-gradient(90deg,var(--color-fg)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(70%_60%_at_50%_30%,black,transparent)]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-100 animate-rise",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex flex-col items-center text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-mute",
						children: "nạp xu · mua vật phẩm · dùng ngay trong game"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-line bg-panel/90 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7",
					children
				})]
			})
		]
	});
}
// src/features/authentication/Auth.jsx
function Auth({ onAuthed }) {
	const [mode, setModeRaw] = (0, import_react.useState)("login");
	const [f, setF] = (0, import_react.useState)(() => ({
		...EMPTY_FORM,
		username: localStorage.getItem("username") || ""
	}));
	const [errors, setErrors] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [caps, setCaps] = (0, import_react.useState)(false);
	const [remember, setRemember] = (0, import_react.useState)(() => !!localStorage.getItem(LAST_USER_KEY));
	const set = (k) => (e) => {
		const v = k === "otp" ? cleanOtp(e.target.value) : k === "username" ? e.target.value.replace(/\s/g, "") : e.target.value;
		setF((s) => ({
			...s,
			[k]: v
		}));
		if (errors[k]) setErrors((s) => ({
			...s,
			[k]: ""
		}));
	};
	const setMode = (m) => {
		setModeRaw(m);
		setErrors({});
		setSent(false);
		setF((s) => ({
			...EMPTY_FORM,
			username: s.username
		}));
	};
	const checkInfo = () => {
		const e = {
			username: validate.username(f.username),
			password: validate.password(f.password),
			confirm: f.confirm !== f.password ? "Mật khẩu nhập lại không khớp" : "",
			openid: validate.openid(f.openid)
		};
		setErrors(e);
		return !hasErrors(e);
	};
	const info = () => ({
		username: f.username,
		password: f.password,
		openid: f.openid.trim()
	});
	const check = () => {
		const e = {};
		if (mode === "login") {
			if (!f.username) e.username = "Nhập tên đăng nhập";
			if (!f.password) e.password = "Nhập mật khẩu";
		} else {
			if (!checkInfo()) return false;
			if (!sent) {
				setErrors({ otp: "Bấm “Gửi mã xác thực” để nhận mã xác thực" });
				return false;
			}
			e.otp = validate.otp(f.otp);
		}
		setErrors(e);
		return !hasErrors(e);
	};
	const run = async (fn) => {
		setLoading(true);
		try {
			await fn();
		} catch (e) {
			if (e.field) setErrors((s) => ({
				...s,
				[e.field]: e.message
			}));
			toast(e.message, "err");
		} finally {
			setLoading(false);
		}
	};
	const doLogin = async () => {
		const r = await login(f.username, f.password);
		if (remember) localStorage.setItem(LAST_USER_KEY, f.username);
		else localStorage.removeItem(LAST_USER_KEY);
		toast(r.message);
		onAuthed(r.user);
	};
	const doRegister = async () => {
		const r = await signup({
			...info(),
			otp: f.otp
		});
		toast(r.message);
		const user = r.user || (await login(f.username, f.password)).user;
		if (user) onAuthed(user);
		else setMode("login");
	};
	const doReset = async () => {
		const r = await resetPassword({
			...info(),
			otp: f.otp
		});
		toast(r.message);
		setMode("login");
	};
	const actions = {
		login: doLogin,
		register: doRegister,
		forgot: doReset
	};
	const submit = (e) => {
		e.preventDefault();
		if (!check()) return;
		run(actions[mode]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthHeader, {
		mode,
		onMode: setMode
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		noValidate: true,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tên đăng nhập",
				value: f.username,
				onChange: set("username"),
				error: errors.username,
				autoComplete: "username",
				autoCapitalize: "none",
				placeholder: "username"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: mode === "forgot" ? "Mật khẩu mới" : "Mật khẩu",
				placeholder: mode === "forgot" ? "newpassword" : "password",
				type: "password",
				value: f.password,
				onChange: set("password"),
				error: errors.password,
				autoComplete: mode === "login" ? "current-password" : "new-password",
				onKeyUp: (e) => setCaps(e.getModifierState?.("CapsLock"))
			}),
			caps && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "-mt-2 flex items-center gap-1.5 text-[11px] text-coin",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconAlertTriangle, { size: 14 }), " Caps Lock đang bật"]
			}),
			mode !== "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StrengthBar, { value: f.password }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Nhập lại mật khẩu",
					type: "password",
					value: f.confirm,
					onChange: set("confirm"),
					error: errors.confirm,
					autoComplete: "new-password",
					placeholder: mode === "forgot" ? "newpassword" : "password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mã người chơi",
					hint: "cài đặt -> con mèo dưới cùng bên phải",
					placeholder: "openid",
					value: f.openid,
					onChange: set("openid"),
					error: errors.openid,
					autoCapitalize: "none",
					right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OtpButton, {
						target: f.openid.trim(),
						send: () => mode === "register" ? signupOtp(info()) : passwordOtp(info()),
						check: checkInfo,
						onSent: () => setSent(true)
					})
				}),
				sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Mã xác thực",
					hint: "cài đặt -> phản hồi",
					maxLength: 12,
					autoCapitalize: "characters",
					autoFocus: true,
					autoComplete: "one-time-code",
					placeholder: "XXXXXXXXXXXX",
					value: f.otp,
					onChange: set("otp"),
					error: errors.otp,
					className: "animate-rise [&_input]:text-center [&_input]:tracking-[0.3em]"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: `flex items-center gap-2 rounded-lg border border-dashed p-3 text-[11px] ${errors.otp ? "border-bad/60 text-bad" : "border-line text-mute"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconShieldCheck, {
							size: 16,
							className: "shrink-0"
						}),
						" ",
						errors.otp || "Điền đầy đủ thông tin rồi bấm “Gửi mã xác thực” để nhận mã xác thực."
					]
				})
			] }),
			mode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center gap-2 text-xs text-mute",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: remember,
						onChange: (e) => setRemember(e.target.checked),
						className: "size-4 accent-lime"
					}), "Nhớ tên đăng nhập"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode("forgot"),
					className: "cursor-pointer text-xs text-mute hover:text-lime",
					children: "Quên mật khẩu?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				loading,
				className: "h-12 w-full",
				children: [
					SUBMIT_LABELS[mode],
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconArrowRight, { size: 16 })
				]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-[11px] text-mute",
				children: "Đang xử lý…"
			})
		]
	})] });
}
export { Auth as default };
