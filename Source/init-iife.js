!(function () {
	"use strict";
	async function e(e, t = {}, n) {
		return window.__TAURI_INTERNALS__.invoke(e, t, n);
	}
	function t() {
		document.querySelector("body")?.addEventListener("click", function (t) {
			let n = t.target;
			for (; n; ) {
				if (n.matches("a")) {
					const r = n;
					"" !== r.href &&
						["http://", "https://", "mailto:", "tel:"].some((e) =>
							r.href.startsWith(e),
						) &&
						"_blank" === r.target &&
						(e("plugin:shell|open", { path: r.href }),
						t.preventDefault());
					break;
				}
				n = n.parentElement;
			}
		});
	}
	"function" == typeof SuppressedError && SuppressedError,
		"complete" === document.readyState ||
		"interactive" === document.readyState
			? t()
			: window.addEventListener("DOMContentLoaded", t, !0);
})();
