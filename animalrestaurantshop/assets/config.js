import { Et as IconBuildingStore, Ot as createReactComponent, n as compareByTime } from "./index.js";
import { n as IconMusic, t as IconUsers } from "./IconUsers.js";
/**
* @license @tabler/icons-react v3.51.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconDatabase = createReactComponent("outline", "database", "Database", [
	["path", {
		"d": "M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M4 6v6a8 3 0 0 0 16 0v-6",
		"key": "svg-1"
	}],
	["path", {
		"d": "M4 12v6a8 3 0 0 0 16 0v-6",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.51.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconDeviceGamepad2 = createReactComponent("outline", "device-gamepad-2", "DeviceGamepad2", [
	["path", {
		"d": "M12 5h3.5a5 5 0 0 1 0 10h-5.5l-4.015 4.227a2.3 2.3 0 0 1 -3.923 -2.035l1.634 -8.173a5 5 0 0 1 4.904 -4.019h3.4",
		"key": "svg-0"
	}],
	["path", {
		"d": "M14 15l4.07 4.284a2.3 2.3 0 0 0 3.925 -2.023l-1.6 -8.232",
		"key": "svg-1"
	}],
	["path", {
		"d": "M8 9v2",
		"key": "svg-2"
	}],
	["path", {
		"d": "M7 10h2",
		"key": "svg-3"
	}],
	["path", {
		"d": "M14 10h2",
		"key": "svg-4"
	}]
]);
/**
* @license @tabler/icons-react v3.51.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconFileText = createReactComponent("outline", "file-text", "FileText", [
	["path", {
		"d": "M14 3v4a1 1 0 0 0 1 1h4",
		"key": "svg-0"
	}],
	["path", {
		"d": "M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2",
		"key": "svg-1"
	}],
	["path", {
		"d": "M9 9l1 0",
		"key": "svg-2"
	}],
	["path", {
		"d": "M9 13l6 0",
		"key": "svg-3"
	}],
	["path", {
		"d": "M9 17l6 0",
		"key": "svg-4"
	}]
]);
/**
* @license @tabler/icons-react v3.51.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconTicket = createReactComponent("outline", "ticket", "Ticket", [
	["path", {
		"d": "M15 5l0 2",
		"key": "svg-0"
	}],
	["path", {
		"d": "M15 11l0 2",
		"key": "svg-1"
	}],
	["path", {
		"d": "M15 17l0 2",
		"key": "svg-2"
	}],
	["path", {
		"d": "M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2",
		"key": "svg-3"
	}]
]);
/**
* @license @tabler/icons-react v3.51.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconUser = createReactComponent("outline", "user", "User", [["path", {
	"d": "M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0",
	"key": "svg-0"
}], ["path", {
	"d": "M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2",
	"key": "svg-1"
}]]);
// src/features/administration/config.js
var ADMIN_TABS = [
	[
		"giftcodes",
		"Mã đổi thưởng",
		IconTicket
	],
	[
		"users",
		"Người dùng",
		IconUsers
	],
	[
		"players",
		"Người chơi",
		IconDeviceGamepad2
	],
	[
		"data",
		"Dữ liệu",
		IconDatabase
	]
];
var EMPTY_GIFT_CODE = {
	code: "",
	date: "",
	coin: ""
};
var USER_SORTS = [
	[
		"created-desc",
		"Ngày tạo · mới nhất",
		compareByTime("createdAt", -1)
	],
	[
		"created-asc",
		"Ngày tạo · cũ nhất",
		compareByTime("createdAt", 1)
	],
	[
		"updated-desc",
		"Ngày sửa · mới nhất",
		compareByTime("updatedAt", -1)
	],
	[
		"updated-asc",
		"Ngày sửa · cũ nhất",
		compareByTime("updatedAt", 1)
	],
	[
		"username-asc",
		"Tên đăng nhập · A → Z",
		(a, b) => String(a.username).localeCompare(String(b.username))
	],
	[
		"username-desc",
		"Tên đăng nhập · Z → A",
		(a, b) => String(b.username).localeCompare(String(a.username))
	],
	[
		"coin-desc",
		"Xu · nhiều nhất",
		(a, b) => b.coin - a.coin
	],
	[
		"coin-asc",
		"Xu · ít nhất",
		(a, b) => a.coin - b.coin
	]
];
var COIN_PRESETS = [
	100,
	500,
	1e3,
	5e3
];
var EMPTY_USER_FORM = {
	openid: "",
	username: "",
	password: "",
	coin: ""
};
var PLAYER_TABS = [
	[
		"player",
		"Người chơi",
		IconUser
	],
	[
		"friends",
		"Bạn bè",
		IconUsers
	],
	[
		"record",
		"Dữ liệu",
		IconDatabase
	]
];
var DATA_TABS = [
	[
		"shop",
		"Cửa hàng",
		IconBuildingStore
	],
	[
		"musicians",
		"Khách mời",
		IconMusic
	],
	[
		"texts",
		"Văn bản",
		IconFileText
	],
	[
		"data",
		"Dữ liệu",
		IconDatabase
	]
];
export { EMPTY_USER_FORM as a, IconUser as c, EMPTY_GIFT_CODE as i, COIN_PRESETS as n, PLAYER_TABS as o, DATA_TABS as r, USER_SORTS as s, ADMIN_TABS as t };
