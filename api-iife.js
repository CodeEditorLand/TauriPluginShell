if ("__TAURI__" in window) {
	var __TAURI_PLUGIN_SHELL__ = (function (e) {
		"use strict";
		function t(e, t, s, n) {
			if ("a" === s && !n)
				throw new TypeError(
					"Private accessor was defined without a getter",
				);
			if ("function" == typeof t ? e !== t || !n : !t.has(e))
				throw new TypeError(
					"Cannot read private member from an object whose class did not declare it",
				);
			return "m" === s
				? n
				: "a" === s
					? n.call(e)
					: n
						? n.value
						: t.get(e);
		}
		function s(e, t, s, n, i) {
			if ("function" == typeof t ? e !== t || !i : !t.has(e))
				throw new TypeError(
					"Cannot write private member to an object whose class did not declare it",
				);
			return t.set(e, s), s;
		}
		var n, i, r;
		"function" == typeof SuppressedError && SuppressedError;
		class o {
			constructor() {
				(this.__TAURI_CHANNEL_MARKER__ = !0),
					n.set(this, () => {}),
					i.set(this, 0),
					r.set(this, {}),
					(this.id = (function (e, t = !1) {
						return window.__TAURI_INTERNALS__.transformCallback(
							e,
							t,
						);
					})(({ message: e, id: o }) => {
						if (o === t(this, i, "f")) {
							s(this, i, o + 1), t(this, n, "f").call(this, e);
							const a = Object.keys(t(this, r, "f"));
							if (a.length > 0) {
								let e = o + 1;
								for (const s of a.sort()) {
									if (parseInt(s) !== e) break;
									{
										const i = t(this, r, "f")[s];
										delete t(this, r, "f")[s],
											t(this, n, "f").call(this, i),
											(e += 1);
									}
								}
								s(this, i, e);
							}
						} else t(this, r, "f")[o.toString()] = e;
					}));
			}
			set onmessage(e) {
				s(this, n, e);
			}
			get onmessage() {
				return t(this, n, "f");
			}
			toJSON() {
				return `__CHANNEL__:${this.id}`;
			}
		}
		async function a(e, t = {}, s) {
			return window.__TAURI_INTERNALS__.invoke(e, t, s);
		}
		(n = new WeakMap()), (i = new WeakMap()), (r = new WeakMap());
		class h {
			constructor() {
				this.eventListeners = Object.create(null);
			}
			addListener(e, t) {
				return this.on(e, t);
			}
			removeListener(e, t) {
				return this.off(e, t);
			}
			on(e, t) {
				return (
					e in this.eventListeners
						? this.eventListeners[e].push(t)
						: (this.eventListeners[e] = [t]),
					this
				);
			}
			once(e, t) {
				const s = (n) => {
					this.removeListener(e, s), t(n);
				};
				return this.addListener(e, s);
			}
			off(e, t) {
				return (
					e in this.eventListeners &&
						(this.eventListeners[e] = this.eventListeners[e].filter(
							(e) => e !== t,
						)),
					this
				);
			}
			removeAllListeners(e) {
				return (
					e
						? delete this.eventListeners[e]
						: (this.eventListeners = Object.create(null)),
					this
				);
			}
			emit(e, t) {
				if (e in this.eventListeners) {
					const s = this.eventListeners[e];
					for (const e of s) e(t);
					return !0;
				}
				return !1;
			}
			listenerCount(e) {
				return e in this.eventListeners
					? this.eventListeners[e].length
					: 0;
			}
			prependListener(e, t) {
				return (
					e in this.eventListeners
						? this.eventListeners[e].unshift(t)
						: (this.eventListeners[e] = [t]),
					this
				);
			}
			prependOnceListener(e, t) {
				const s = (n) => {
					this.removeListener(e, s), t(n);
				};
				return this.prependListener(e, s);
			}
		}
		class c {
			constructor(e) {
				this.pid = e;
			}
			async write(e) {
				await a("plugin:shell|stdin_write", {
					pid: this.pid,
					buffer: "string" == typeof e ? e : Array.from(e),
				});
			}
			async kill() {
				await a("plugin:shell|kill", {
					cmd: "killChild",
					pid: this.pid,
				});
			}
		}
		class l extends h {
			constructor(e, t = [], s) {
				super(),
					(this.stdout = new h()),
					(this.stderr = new h()),
					(this.program = e),
					(this.args = "string" == typeof t ? [t] : t),
					(this.options = s ?? {});
			}
			static create(e, t = [], s) {
				return new l(e, t, s);
			}
			static sidecar(e, t = [], s) {
				const n = new l(e, t, s);
				return (n.options.sidecar = !0), n;
			}
			async spawn() {
				const e = this.program,
					t = this.args,
					s = this.options;
				"object" == typeof t && Object.freeze(t);
				const n = new o();
				return (
					(n.onmessage = (e) => {
						switch (e.event) {
							case "Error":
								this.emit("error", e.payload);
								break;
							case "Terminated":
								this.emit("close", e.payload);
								break;
							case "Stdout":
								this.stdout.emit("data", e.payload);
								break;
							case "Stderr":
								this.stderr.emit("data", e.payload);
						}
					}),
					await a("plugin:shell|spawn", {
						program: e,
						args: t,
						options: s,
						onEvent: n,
					}).then((e) => new c(e))
				);
			}
			async execute() {
				const e = this.program,
					t = this.args,
					s = this.options;
				return (
					"object" == typeof t && Object.freeze(t),
					await a("plugin:shell|execute", {
						program: e,
						args: t,
						options: s,
					})
				);
			}
		}
		return (
			(e.Child = c),
			(e.Command = l),
			(e.EventEmitter = h),
			(e.open = async function (e, t) {
				await a("plugin:shell|open", { path: e, with: t });
			}),
			e
		);
	})({});
	Object.defineProperty(window.__TAURI__, "shell", {
		value: __TAURI_PLUGIN_SHELL__,
	});
}
