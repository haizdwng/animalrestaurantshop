import { ut as toast, xt as createReactComponent } from "./index.js";
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconCopy = createReactComponent("outline", "copy", "Copy", [["path", {
	"d": "M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666",
	"key": "svg-0"
}], ["path", {
	"d": "M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1",
	"key": "svg-1"
}]]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconLock = createReactComponent("outline", "lock", "Lock", [
	["path", {
		"d": "M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6",
		"key": "svg-0"
	}],
	["path", {
		"d": "M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M8 11v-4a4 4 0 1 1 8 0v4",
		"key": "svg-2"
	}]
]);
/**
* @license @tabler/icons-react v3.49.0 - MIT
*
* This source code is licensed under the MIT license.
* See the LICENSE file in the root directory of this source tree.
*/
var IconSearch = createReactComponent("outline", "search", "Search", [["path", {
	"d": "M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0",
	"key": "svg-0"
}], ["path", {
	"d": "M21 21l-6 -6",
	"key": "svg-1"
}]]);
// src/shared/library/clipboard.js
var copyText = (text, msg) => navigator.clipboard?.writeText(text).then(() => toast(msg, "info"));
export { IconCopy as i, IconSearch as n, IconLock as r, copyText as t };
