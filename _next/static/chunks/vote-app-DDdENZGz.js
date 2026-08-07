import { r as __toESM } from "./rolldown-runtime-DFEGrk7x.js";
import { i as require_jsx_runtime, r as require_react } from "./framework-CZh43tRa.js";
import { r as scenes, t as groupLabel } from "./scenes-B8_PTtUj.js";
//#region app/vote-config.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* 留空时进入「本地模式」：不发任何请求，结果只存在浏览器里并在结果页显示
* 完整 JSON。这样在还没配好飞书之前，页面就可以拿去试手感。
*/
var isLocalMode = () => "".trim() === "";
var ROLES = [
	{
		id: "sales",
		label: "销售"
	},
	{
		id: "rd",
		label: "研发"
	},
	{
		id: "pm",
		label: "产品"
	},
	{
		id: "other",
		label: "其他"
	}
];
/** localStorage 的键。结构变了就升版本号，旧记录会被当作没有进度。 */
var STORAGE_KEY = "a100.vote.v1";
/** 提交成功后单独留一份，页面清了进度也还能翻出来重发。 */
var RECEIPT_KEY = "a100.vote.receipt.v1";
/**
* 单次提交请求的超时。飞书 webhook 正常在 1s 内返回；卡住不给上限的话，
* 用户会对着转圈的按钮一直等，也拖着后面的降级链路不动。
*/
var SUBMIT_TIMEOUT_MS = 8e3;
/**
* 卡面上每半张海报取原图左/右两侧的比例。
*
* 海报是 1000×442 的左右对比横图，中间那条白色分割线是斜的，各张的斜度和
* 位置都不一样（实测最窄处约 x=420，最宽处约 x=530）。取 0.44 相当于只用
* 原图最外侧 44% 的宽度，把 [440, 560] 这段分割线整个让开，两半就不会互相
* 串画面。数字调小=裁得更狠、画面更大，调大=更完整但可能吃到对面的画。
*/
var POSTER_HALF = .44;
//#endregion
//#region app/components/vote-store.ts
/**
* /vote 的状态形状、localStorage 读写，以及最终提交给飞书的那份 JSON。
*
* 这里不碰 DOM 也不发请求，方便单独推敲。UI 在 vote-deck.tsx，网络在
* vote-submit.ts。
*/
var TOTAL = scenes.length;
var sceneByNo = new Map(scenes.map((s) => [s.no, s]));
var sceneOf = (no) => sceneByNo.get(no);
var roleLabel = (id) => ROLES.find((r) => r.id === id)?.label ?? "";
/**
* Fisher–Yates。每个人的卡序都要重新打乱：固定顺序下排在前面的场景天然拿到
* 更多注意力，19 张划到后面人也累了，票数会系统性地偏向前几张。
*/
function shuffle(input) {
	const out = input.slice();
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[out[i], out[j]] = [out[j], out[i]];
	}
	return out;
}
function randomId() {
	const bytes = new Uint8Array(8);
	crypto.getRandomValues(bytes);
	return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function createState(name, role) {
	return {
		v: 1,
		name: name.trim(),
		role,
		order: shuffle(scenes.map((s) => s.no)),
		cursor: 0,
		choices: {},
		reasons: {},
		startedAt: Date.now(),
		finishedAt: null,
		clientId: randomId()
	};
}
/**
* 必做按「划到的先后」排，不排序：卡序本来就是随机的，先选到哪个纯属偶然，
* 但 must_1/2/3 和 reason_1/2/3 是按这个顺序配对的，动了就对不上了。
*/
var mustList = (state) => state.order.filter((no) => state.choices[no] === "must");
/**
* 心动按场景编号升序，不按划到的先后：那个顺序是随机卡序的副产物，不含信息，
* 却会让表格里每一行的 like_nos 长得都不一样，跨行对比时很难读。
*/
var likeList = (state) => state.order.filter((no) => state.choices[no] === "like").sort((a, b) => a - b);
var mustLeft = (state) => 3 - mustList(state).length;
var isFinished = (state) => state.cursor >= TOTAL;
function loadState() {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed?.v !== 1 || !Array.isArray(parsed.order)) return null;
		if (parsed.order.length !== TOTAL) return null;
		if (parsed.order.some((no) => !sceneByNo.has(no))) return null;
		return parsed;
	} catch {
		return null;
	}
}
function saveState(state) {
	try {
		if (state === null) window.localStorage.removeItem(STORAGE_KEY);
		else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {}
}
/** undefined 表示还没读过盘，null 表示读过了、确实没有进度。 */
var cached;
var listeners = /* @__PURE__ */ new Set();
function subscribeVote(onChange) {
	listeners.add(onChange);
	return () => {
		listeners.delete(onChange);
	};
}
function readVote() {
	if (cached === void 0) cached = loadState();
	return cached;
}
/** 必须返回一个常量，否则 React 会判定快照一直在变而反复重渲。 */
function readVoteOnServer() {}
function writeVote(next) {
	cached = typeof next === "function" ? next(readVote()) : next;
	saveState(cached);
	for (const onChange of listeners) onChange();
}
var pad2$1 = (n) => String(n).padStart(2, "0");
/** 本地时区的 "YYYY-MM-DD HH:mm:ss"。用字符串而不是时间戳，是为了让多维表格
*  那一列可以直接建成文本，不用管时区解析。 */
function localStamp(ms) {
	const d = new Date(ms);
	return `${d.getFullYear()}-${pad2$1(d.getMonth() + 1)}-${pad2$1(d.getDate())} ${pad2$1(d.getHours())}:${pad2$1(d.getMinutes())}:${pad2$1(d.getSeconds())}`;
}
/** 「09 AI老人守护」——编号在前，表格里一眼能对上海报。 */
var label = (no) => `${pad2$1(no)} ${sceneOf(no).name}`;
function buildPayload(state, now = Date.now()) {
	const likes = likeList(state);
	const musts = mustList(state);
	const end = state.finishedAt ?? now;
	const payload = {
		name: state.name || "（未填）",
		role: roleLabel(state.role),
		submitted_at: localStamp(now),
		duration_seconds: Math.max(0, Math.round((end - state.startedAt) / 1e3)),
		like_count: likes.length,
		like_nos: likes.map(pad2$1).join(","),
		like_names: likes.map((no) => sceneOf(no).name).join("、"),
		must_nos: musts.map(pad2$1).join(","),
		must_1: "",
		reason_1: "",
		must_2: "",
		reason_2: "",
		must_3: "",
		reason_3: "",
		client_id: state.clientId
	};
	for (let i = 0; i < 3; i++) {
		const no = musts[i];
		const slot = i + 1;
		payload[`must_${slot}`] = no === void 0 ? "" : label(no);
		payload[`reason_${slot}`] = no === void 0 ? "" : state.reasons[no] ?? "";
	}
	return payload;
}
//#endregion
//#region app/components/vote-submit.ts
/**
* 把一份投票结果送到飞书多维表格的 webhook。
*
* 前提：站点是 GitHub Pages 上的纯静态页，没有自己的后端可以中转，所以这个
* POST 一定是**跨域**的，成败完全取决于飞书那个端点给不给 CORS 响应头。
* 这一点无法在本地测出来，只能在代码里把三档降级都铺好：
*
*   ① cors     —— 正常 fetch，application/json。能读到状态码，是唯一能确认
*                  「服务端真的收下了」的一档。
*   ② no-cors  —— 浏览器不再要求对方回 CORS 头，请求照发，但响应是 opaque：
*                  status 恒为 0，读不到任何内容。只能确认「发出去了」。
*                  这一档下 Content-Type 只能是 CORS 安全头允许的几个简单值，
*                  写 application/json 会被规范直接从请求头里剔除，反而更乱，
*                  所以显式用 text/plain。飞书能不能把 text/plain 的 body 当
*                  JSON 解析，是这条链路唯一剩下的不确定性。
*   ③ manual   —— 两档都发不出去（断网、地址填错、被网关拦掉）。这时不再重试，
*                  由结果页给出「复制结果」按钮，让用户手工贴给发起人。
*
* ①里如果拿到的是 4xx/5xx，说明 CORS 是通的、服务端明确拒收，属于终态：
* 再用 no-cors 盲发一遍只会得到一次「看起来成功」的假象，把真正的错误藏起来。
*/
/** 每一档都要有上限，否则请求挂住时用户会一直对着转圈的按钮等。 */
async function postWithTimeout(url, init) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
	try {
		return await fetch(url, {
			...init,
			signal: controller.signal
		});
	} finally {
		clearTimeout(timer);
	}
}
/** 提交结果单独落一份盘。链路走到哪一档都写，用户清了进度也还能找回来重发。 */
function saveReceipt(payload, result) {
	try {
		window.localStorage.setItem(RECEIPT_KEY, JSON.stringify({
			at: Date.now(),
			result,
			payload
		}));
	} catch {}
}
async function submitVote(payload) {
	const body = JSON.stringify(payload);
	if (isLocalMode()) {
		const result = {
			ok: true,
			via: "local",
			message: "已保存到本机（本地模式）",
			detail: "app/vote-config.ts 里的 FEISHU_WEBHOOK_URL 还是空的，没有发出任何网络请求。"
		};
		saveReceipt(payload, result);
		return result;
	}
	const url = "".trim();
	let corsError = "";
	try {
		const res = await postWithTimeout(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body
		});
		if (res.ok) {
			const result = {
				ok: true,
				via: "cors",
				message: "已提交，飞书那边收到了",
				detail: `HTTP ${res.status}`
			};
			saveReceipt(payload, result);
			return result;
		}
		const result = {
			ok: false,
			via: "cors",
			message: `提交失败：飞书返回 ${res.status}`,
			detail: `请求发出去了、跨域也是通的，但服务端拒收（HTTP ${res.status}）。多半是 webhook 地址过期或自动化流程被停用了。结果已存在本机，可以用下面的「复制结果」发给发起人。`
		};
		saveReceipt(payload, result);
		return result;
	} catch (err) {
		corsError = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
	}
	try {
		await postWithTimeout(url, {
			method: "POST",
			mode: "no-cors",
			headers: { "Content-Type": "text/plain;charset=UTF-8" },
			body
		});
		const result = {
			ok: true,
			via: "no-cors",
			message: "已发出（浏览器读不到回执）",
			detail: `第一次请求被跨域策略挡住了，已改用 no-cors 盲发一次：请求确实送出去了，但浏览器不允许读取响应，无法确认飞书是否真的落库。结果已存在本机。第一档的报错：${corsError}`
		};
		saveReceipt(payload, result);
		return result;
	} catch (err) {
		const noCorsError = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
		const result = {
			ok: false,
			via: "manual",
			message: "网络没通，请用下面的「复制结果」手工提交",
			detail: `两档都没发出去，通常是断网、地址填错，或所在网络把这个域名拦掉了。结果已存在本机，不会丢。第一档：${corsError}；第二档：${noCorsError}`
		};
		saveReceipt(payload, result);
		return result;
	}
}
//#endregion
//#region app/components/vote-result.tsx
var import_jsx_runtime = require_jsx_runtime();
var pad2 = (n) => String(n).padStart(2, "0");
/**
* 复制到剪贴板。
*
* navigator.clipboard 需要安全上下文，而且微信内置浏览器上偶尔会直接 reject，
* 所以留一条 execCommand 的老路。它已废弃但在各家 WebView 里仍然最稳，
* 而「复制结果」正是跨域全挂之后的最后一档兜底，不能它自己也失效。
*/
async function copyText(text) {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch {}
	try {
		const box = document.createElement("textarea");
		box.value = text;
		box.setAttribute("readonly", "");
		box.style.position = "fixed";
		box.style.top = "-1000px";
		document.body.appendChild(box);
		box.select();
		box.setSelectionRange(0, text.length);
		const ok = document.execCommand("copy");
		document.body.removeChild(box);
		return ok;
	} catch {
		return false;
	}
}
function VoteResult({ state, onUndo, onRestart }) {
	const [sending, setSending] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)("");
	const [showJson, setShowJson] = (0, import_react.useState)(isLocalMode());
	const musts = (0, import_react.useMemo)(() => mustList(state), [state]);
	const likes = (0, import_react.useMemo)(() => likeList(state), [state]);
	const payload = (0, import_react.useMemo)(() => buildPayload(state), [state]);
	const json = (0, import_react.useMemo)(() => JSON.stringify(payload, null, 2), [payload]);
	const minutes = Math.floor(payload.duration_seconds / 60);
	const seconds = payload.duration_seconds % 60;
	const send = async () => {
		setSending(true);
		setResult(await submitVote(payload));
		setSending(false);
	};
	const copy = async (text, label) => {
		setCopied(await copyText(text) ? label : "复制失败，请长按选中");
		window.setTimeout(() => setCopied(""), 2200);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "vote-result",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "vote-share",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "vote-share-head",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "MY PICKS"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "我的选择" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "vote-share-who",
							children: [
								state.name || "匿名",
								roleLabel(state.role) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" · ", roleLabel(state.role)] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [" · ", payload.submitted_at.slice(0, 10)] })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vote-share-stats",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: musts.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "一定要做" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: likes.length }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "心动" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [
							minutes > 0 ? `${minutes}′` : "",
							pad2(seconds),
							minutes > 0 ? "″" : "s"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
							"划完 ",
							TOTAL,
							" 张"
						] })] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "vote-share-title",
					children: ["一定要做 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
						"最多 ",
						3,
						" 个"
					] })]
				}),
				musts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "vote-empty",
					children: "一个都没选，那就先按「心动」排"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "vote-must-list",
					children: musts.map((no, i) => {
						const scene = sceneOf(no);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "vote-must-rank",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: pad2(scene.no) }), scene.name] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "vote-must-claim",
								children: scene.claim
							}),
							state.reasons[no] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("q", { children: state.reasons[no] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "（没写理由）" })
						] })] }, no);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "vote-share-title",
					children: ["心动 ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [likes.length, " 个"] })]
				}),
				likes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "vote-empty",
					children: "这一轮没有心动的场景"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "vote-like-list",
					children: likes.map((no) => {
						const scene = sceneOf(no);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: pad2(scene.no) }),
							scene.name,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
								className: `tag-${scene.group}`,
								children: groupLabel[scene.group]
							})
						] }, no);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "vote-share-foot",
					children: "A100 AI家庭看护助手 · 场景优先级投票"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "vote-submit",
			children: [
				result === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "vote-send",
					onClick: send,
					disabled: sending,
					children: sending ? "提交中…" : "提交我的选择"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "vote-submit-note",
					children: isLocalMode() ? "当前是本地模式：还没配飞书 webhook，提交只会存在这台设备上。" : "提交后可以截图上面这张卡片发群里。"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: result.ok ? "vote-outcome is-ok" : "vote-outcome is-bad",
						children: [
							result.ok ? "✓" : "!",
							" ",
							result.message
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "vote-outcome-detail",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: "技术细节" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"走的是 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: result.via }),
							" 这一档。",
							result.detail
						] })]
					}),
					!result.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vote-send",
						onClick: send,
						children: "再试一次"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vote-submit-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vote-ghost",
						onClick: () => copy(json, "已复制 JSON"),
						children: "复制结果"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vote-ghost",
						onClick: () => setShowJson((v) => !v),
						"aria-expanded": showJson,
						children: showJson ? "收起 JSON" : "查看 JSON"
					})]
				}),
				copied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "vote-copied",
					role: "status",
					children: copied
				}),
				(result?.ok === false || result?.via === "no-cors") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "vote-submit-note",
					children: "结果已经存在这台设备上，不会丢。把上面复制到的内容发给发起人即可。"
				}),
				showJson && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "vote-json",
					children: json
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vote-submit-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vote-ghost",
						onClick: onUndo,
						children: "回上一张改"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vote-ghost is-danger",
						onClick: () => {
							if (window.confirm("清掉这一轮，从头开始？")) onRestart();
						},
						children: "重新投一次"
					})]
				})
			]
		})]
	});
}
//#endregion
//#region app/components/vote-app.tsx
/** 左右判定：卡片宽度的 25%。Tinder 系产品的通行手感，一屏内划过约四分之一。 */
var H_RATIO = .25;
var H_MIN = 72;
/**
* 上滑判定（一定要做）：卡片高度的 18%。
* 比横向那档更难触发是刻意的——名额只有 3 个，误触的代价比划错左右大得多。
*/
var V_RATIO = .18;
var V_MIN = 90;
/**
* 甩动逃生阀。松手瞬间速度超过 0.55 px/ms（约 550px/s）就直接判定，不看位移，
* 否则「快速轻甩」这个最自然的动作会因为位移不够而被弹回来，手感立刻就假了。
* 配一个 24px 的最小位移，避免点按时的手指抖动被当成甩动。
*/
var FLICK_V = .55;
var FLICK_MIN_PX = 24;
/**
* 上滑必须明显比横移大才算。斜着划的时候优先判成左右，
* 宁可少判一次必做，也不要把仅有的 3 个名额烧在一次手滑上。
*/
var V_DOMINANCE = 1.25;
/** 跟手旋转的最大角度。 */
var MAX_TILT = 14;
/** 飞出动画时长，和 CSS 里的 transition 对齐。 */
var EXIT_MS = 300;
var SNAP_MS = 260;
/** 同时挂在 DOM 上的卡片数。再多也看不见，只是白白多下载几张图。 */
var STACK = 3;
var clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
function VoteApp() {
	const state = (0, import_react.useSyncExternalStore)(subscribeVote, readVote, readVoteOnServer);
	const [toast, setToast] = (0, import_react.useState)("");
	const [reasonFor, setReasonFor] = (0, import_react.useState)(null);
	const [reasonDraft, setReasonDraft] = (0, import_react.useState)("");
	const cardRef = (0, import_react.useRef)(null);
	const busy = (0, import_react.useRef)(false);
	const drag = (0, import_react.useRef)({
		id: -1,
		x0: 0,
		y0: 0,
		lx: 0,
		ly: 0,
		lt: 0,
		vx: 0,
		vy: 0,
		active: false
	});
	const toastTimer = (0, import_react.useRef)(void 0);
	(0, import_react.useEffect)(() => () => window.clearTimeout(toastTimer.current), []);
	const flash = (0, import_react.useCallback)((message) => {
		setToast(message);
		window.clearTimeout(toastTimer.current);
		toastTimer.current = window.setTimeout(() => setToast(""), 2200);
	}, []);
	const paint = (0, import_react.useCallback)((dx, dy) => {
		const el = cardRef.current;
		if (!el) return;
		const w = el.offsetWidth || 320;
		const h = el.offsetHeight || 480;
		const tilt = clamp(dx / w * MAX_TILT * 2, -MAX_TILT, MAX_TILT);
		el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${tilt}deg)`;
		const hT = Math.max(H_MIN, w * H_RATIO);
		const vT = Math.max(V_MIN, h * V_RATIO);
		const up = dy < 0 && Math.abs(dy) > Math.abs(dx) * V_DOMINANCE;
		el.style.setProperty("--like", String(up ? 0 : clamp(dx / hT, 0, 1)));
		el.style.setProperty("--nope", String(up ? 0 : clamp(-dx / hT, 0, 1)));
		el.style.setProperty("--must", String(up ? clamp(-dy / vT, 0, 1) : 0));
	}, []);
	const snapBack = (0, import_react.useCallback)(() => {
		const el = cardRef.current;
		if (!el) return;
		el.style.transition = `transform ${SNAP_MS}ms cubic-bezier(.2,.9,.3,1)`;
		el.style.transform = "translate3d(0,0,0) rotate(0deg)";
		el.style.setProperty("--like", "0");
		el.style.setProperty("--nope", "0");
		el.style.setProperty("--must", "0");
	}, []);
	/** 把选择写进状态，并把卡序推进一张。 */
	const applyChoice = (0, import_react.useCallback)((no, choice) => {
		writeVote((prev) => {
			if (!prev) return prev;
			const cursor = prev.cursor + 1;
			return {
				...prev,
				cursor,
				choices: {
					...prev.choices,
					[no]: choice
				},
				finishedAt: cursor >= TOTAL ? Date.now() : null
			};
		});
	}, []);
	const commit = (0, import_react.useCallback)((choice) => {
		if (busy.current || !state || isFinished(state)) return;
		const no = state.order[state.cursor];
		if (choice === "must" && mustLeft(state) <= 0) {
			flash(`「一定要做」只有 3 个名额，已经用完了`);
			snapBack();
			return;
		}
		busy.current = true;
		const el = cardRef.current;
		if (el) {
			const w = el.offsetWidth || 320;
			const fly = choice === "must" ? `translate3d(0, -140%, 0) rotate(0deg)` : `translate3d(${choice === "like" ? w * 1.6 : -w * 1.6}px, 40px, 0) rotate(${choice === "like" ? MAX_TILT + 6 : -MAX_TILT - 6}deg)`;
			el.style.transition = `transform ${EXIT_MS}ms cubic-bezier(.3,.6,.4,1), opacity ${EXIT_MS}ms linear`;
			el.style.transform = fly;
			el.style.opacity = "0";
		}
		window.setTimeout(() => {
			applyChoice(no, choice);
			busy.current = false;
			if (choice === "must") {
				setReasonDraft("");
				setReasonFor(no);
			}
		}, EXIT_MS);
	}, [
		state,
		applyChoice,
		flash,
		snapBack
	]);
	const onPointerDown = (event) => {
		if (busy.current || reasonFor !== null) return;
		if (event.pointerType === "mouse" && event.button !== 0) return;
		const el = cardRef.current;
		if (!el) return;
		el.setPointerCapture(event.pointerId);
		el.style.transition = "none";
		const now = performance.now();
		drag.current = {
			id: event.pointerId,
			x0: event.clientX,
			y0: event.clientY,
			lx: event.clientX,
			ly: event.clientY,
			lt: now,
			vx: 0,
			vy: 0,
			active: true
		};
	};
	const onPointerMove = (event) => {
		const d = drag.current;
		if (!d.active || event.pointerId !== d.id) return;
		const now = performance.now();
		const dt = now - d.lt;
		if (dt > 0) {
			d.vx = (event.clientX - d.lx) / dt;
			d.vy = (event.clientY - d.ly) / dt;
			d.lx = event.clientX;
			d.ly = event.clientY;
			d.lt = now;
		}
		paint(event.clientX - d.x0, event.clientY - d.y0);
	};
	const endDrag = (event) => {
		const d = drag.current;
		if (!d.active || event.pointerId !== d.id) return;
		d.active = false;
		try {
			cardRef.current?.releasePointerCapture(event.pointerId);
		} catch {}
		const dx = event.clientX - d.x0;
		const dy = event.clientY - d.y0;
		const el = cardRef.current;
		const w = el?.offsetWidth || 320;
		const h = el?.offsetHeight || 480;
		const hT = Math.max(H_MIN, w * H_RATIO);
		const vT = Math.max(V_MIN, h * V_RATIO);
		const fresh = performance.now() - d.lt < 120;
		const flickX = fresh && Math.abs(d.vx) > FLICK_V && Math.abs(dx) > FLICK_MIN_PX;
		const flickY = fresh && d.vy < -FLICK_V && Math.abs(dy) > FLICK_MIN_PX;
		const upward = dy < 0 && Math.abs(dy) > Math.abs(dx) * V_DOMINANCE;
		if (upward && (-dy > vT || flickY)) commit("must");
		else if (!upward && (dx > hT || flickX && d.vx > 0)) commit("like");
		else if (!upward && (-dx > hT || flickX && d.vx < 0)) commit("pass");
		else snapBack();
	};
	const deckActive = !!state && !isFinished(state);
	(0, import_react.useEffect)(() => {
		if (!deckActive || reasonFor !== null) return;
		const onKey = (event) => {
			const target = event.target;
			if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
			if (event.key === "ArrowLeft") commit("pass");
			else if (event.key === "ArrowRight") commit("like");
			else if (event.key === "ArrowUp") commit("must");
			else return;
			event.preventDefault();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		deckActive,
		reasonFor,
		commit
	]);
	const undo = (0, import_react.useCallback)(() => {
		if (busy.current) return;
		writeVote((prev) => {
			if (!prev || prev.cursor === 0) return prev;
			const cursor = prev.cursor - 1;
			const no = prev.order[cursor];
			const choices = { ...prev.choices };
			const reasons = { ...prev.reasons };
			delete choices[no];
			delete reasons[no];
			return {
				...prev,
				cursor,
				choices,
				reasons,
				finishedAt: null
			};
		});
	}, []);
	const restart = (0, import_react.useCallback)(() => writeVote(null), []);
	if (state === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "vote-shell",
		"data-phase": "loading",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "vote-loading",
			children: "正在准备…"
		})
	});
	if (state === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "vote-shell",
		"data-phase": "intro",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoteIntro, { onStart: (name, role) => writeVote(createState(name, role)) })
	});
	if (isFinished(state)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "vote-shell",
		"data-phase": "result",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoteResult, {
			state,
			onUndo: undo,
			onRestart: restart
		})
	});
	const left = mustLeft(state);
	const stack = state.order.slice(state.cursor, state.cursor + STACK);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "vote-shell",
		"data-phase": "deck",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "vote-bar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vote-bar-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "vote-progress",
						children: [
							"第 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: state.cursor + 1 }),
							" / ",
							TOTAL
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "vote-quota",
						"aria-label": `一定要做还剩 ${left} 个名额`,
						children: [
							"一定要做",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "vote-quota-dots",
								"aria-hidden": "true",
								children: Array.from({ length: 3 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: i < left ? "is-open" : "is-used" }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: left })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "vote-rail",
					"aria-hidden": "true",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${state.cursor / TOTAL * 100}%` } })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vote-stage",
				children: stack.map((no, depth) => {
					const scene = sceneOf(no);
					const isTop = depth === 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						ref: isTop ? cardRef : void 0,
						className: isTop ? "vote-card is-top" : "vote-card",
						style: {
							"--depth": depth,
							zIndex: STACK - depth,
							"--poster-half": POSTER_HALF
						},
						onPointerDown: isTop ? onPointerDown : void 0,
						onPointerMove: isTop ? onPointerMove : void 0,
						onPointerUp: isTop ? endDrag : void 0,
						onPointerCancel: isTop ? endDrag : void 0,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "vote-poster",
								role: "img",
								"aria-label": `${scene.name}对照画面：现在${scene.problem.title}，A100 ${scene.answer.title}`,
								children: ["problem", "answer"].map((side) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `vote-poster-half is-${side}`,
									style: { backgroundImage: `url(/media/${scene.media}-1500.webp)` },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "vote-poster-label",
										children: side === "problem" ? "现在" : "A100"
									})
								}, side))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "vote-card-foot",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "vote-card-head",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "vote-card-no",
											children: String(scene.no).padStart(2, "0")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: scene.name }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `scene-tag tag-${scene.group}`,
											children: groupLabel[scene.group]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: scene.claim })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "vote-stamp is-like",
								"aria-hidden": "true",
								children: "心动"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "vote-stamp is-nope",
								"aria-hidden": "true",
								children: "PASS"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "vote-stamp is-must",
								"aria-hidden": "true",
								children: "一定要做"
							})
						]
					}, no);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "vote-actions",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vote-btn vote-btn-undo",
						onClick: undo,
						disabled: state.cursor === 0,
						"aria-label": "撤销上一张",
						children: "撤销"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "vote-btn vote-btn-pass",
						onClick: () => commit("pass"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "✕"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Pass" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "vote-btn vote-btn-must",
						onClick: () => commit("must"),
						disabled: left <= 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "★"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: left > 0 ? `一定要做 ${left}` : "名额用完" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "vote-btn vote-btn-like",
						onClick: () => commit("like"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							children: "♥"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "心动" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "vote-hint",
				children: "左滑 Pass · 右滑心动 · 上滑一定要做 · 也可以用方向键"
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "vote-toast",
				role: "status",
				children: toast
			}),
			reasonFor !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReasonPrompt, {
				sceneName: sceneOf(reasonFor).name,
				value: reasonDraft,
				onChange: setReasonDraft,
				onDone: (text) => {
					const no = reasonFor;
					writeVote((prev) => prev ? {
						...prev,
						reasons: {
							...prev.reasons,
							[no]: text
						}
					} : prev);
					setReasonFor(null);
				}
			})
		]
	});
}
function VoteIntro({ onStart }) {
	const [name, setName] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "vote-intro",
		onSubmit: (event) => {
			event.preventDefault();
			if (role) onStart(name, role);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "SCENE PRIORITY"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "19 个场景，先做哪几个？" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "vote-intro-lead",
				children: "接下来的模型能力和数据集，按大家投出来的优先级排。 一张一张过，凭第一感觉就行，整个过程大约 2 分钟。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "vote-rules",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "右滑 / 心动" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "这个场景有价值，值得做" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "左滑 / Pass" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "这一版可以先不做" })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "is-scarce",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "上滑 / 一定要做" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"全程只有 ",
							3,
							" 个名额，选完就没了"
						] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "vote-field",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "你的名字（选填）" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					name: "name",
					value: name,
					maxLength: 20,
					autoComplete: "name",
					placeholder: "方便有问题时找你聊两句",
					onChange: (event) => setName(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "vote-field vote-roles",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "你的角色" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "vote-role-grid",
					children: ROLES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: role === item.id ? "vote-role is-active" : "vote-role",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "role",
							value: item.id,
							checked: role === item.id,
							onChange: () => setRole(item.id)
						}), item.label]
					}, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "vote-start",
				disabled: !role,
				children: "开始"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "vote-intro-foot",
				children: "投完之前不会显示任何汇总数据，免得受别人影响。进度存在本机，中途退出不丢。"
			})
		]
	});
}
function ReasonPrompt({ sceneName, value, onChange, onDone }) {
	const inputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "vote-modal",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": "填写理由",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "vote-modal-panel",
			onSubmit: (event) => {
				event.preventDefault();
				onDone(value.trim());
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "vote-modal-title",
					children: [
						"为什么",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: sceneName }),
						"必须做？"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "text",
					value,
					maxLength: 60,
					enterKeyHint: "done",
					placeholder: "一句话就行，可以跳过",
					onChange: (event) => onChange(event.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "vote-modal-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vote-modal-skip",
						onClick: () => onDone(""),
						children: "跳过"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "vote-modal-ok",
						children: "记下了"
					})]
				})
			]
		})
	});
}
//#endregion
export { VoteApp };
