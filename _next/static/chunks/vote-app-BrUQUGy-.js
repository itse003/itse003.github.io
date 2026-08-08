import { r as __toESM } from "./rolldown-runtime-DFEGrk7x.js";
import { i as require_jsx_runtime, r as require_react } from "./framework-CZh43tRa.js";
import { r as scenes, t as groupLabel } from "./scenes-B8_PTtUj.js";
//#region app/vote-config.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* /vote 滑卡投票页的全部可配置项。
*
* 这个站是纯静态托管（GitHub Pages），没有后端，所以「配置」只能是编译进包里的
* 常量——不能读运行时环境变量。改完要重新 build + 重新导出才会生效。
*/
/**
* 飞书多维表格自动化「当收到 webhook 时」给出的地址。
*
* ⬇⬇⬇ 就填这一行 ⬇⬇⬇
*/
var FEISHU_WEBHOOK_URL = "https://modelbest.feishu.cn/base/automation/webhook/event/G8q0aDuQnwpmWrhwdIIcw6IQn4b";
/**
* 飞书企业自建应用的 App ID（cli_ 开头）。App ID 可以公开，App Secret 绝不能
* 写在前端；Secret 只填进飞书多维表格自动化的 HTTP 请求动作。
*
* 留空时身份功能完全关闭，提交格式保持旧版不变，方便在飞书应用配置完成之前继续
* 使用现有投票链路。
*/
var FEISHU_APP_ID = "cli_aafc67977cb89bd4";
/** 必须与飞书开放平台「安全设置 → 重定向 URL」逐字一致。 */
var FEISHU_OAUTH_REDIRECT_URI = "https://itse003.github.io/vote";
var isFeishuIdentityEnabled = () => /^cli_[A-Za-z0-9]+$/.test(FEISHU_APP_ID);
/**
* 留空时进入「本地模式」：不发任何请求，结果只存在浏览器里。调试数据不直接
* 暴露在普通结果页；真实网络发送失败时才提供复制 payload 的兜底按钮。
*/
var isLocalMode = () => FEISHU_WEBHOOK_URL.trim() === "";
/**
* 角色只用来事后按岗位分组看分歧，所以仍放在结果页，避免在开场设门槛；为了让
* 每份结果都能参与分组统计，提交前必须选择一项。
*/
var ROLES = [
	{
		id: "sales",
		label: "销售/市场"
	},
	{
		id: "rd",
		label: "研发/算法"
	},
	{
		id: "pm",
		label: "产品/项目"
	},
	{
		id: "qa",
		label: "评测/测试"
	},
	{
		id: "data",
		label: "数据"
	},
	{
		id: "function",
		label: "职能"
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
function createState() {
	return {
		v: 4,
		role: "",
		order: shuffle(scenes.map((s) => s.no)),
		cursor: 0,
		choices: {},
		picks: [],
		reasons: {},
		startedAt: Date.now(),
		finishedAt: null,
		clientId: randomId()
	};
}
/**
* 心动按场景编号升序，不按划到的先后：那个顺序是随机卡序的副产物，不含信息，
* 却会让表格里每一行的 like_nos 长得都不一样，跨行对比时很难读。
*/
var likeList = (state) => state.order.filter((no) => state.choices[no] === "like").sort((a, b) => a - b);
var isFinished = (state) => state.cursor >= TOTAL;
/**
* 前三名只在「心动」里选。Pass 掉的场景再排优先级是自相矛盾的，
* 而且把 19 个全列出来等于让人在结果页把整轮再做一遍。
*/
var pickList = (state) => state.picks.filter((no) => state.choices[no] === "like");
var picksLeft = (state) => 3 - pickList(state).length;
/**
* 点一下切换选中。已选就取消（连带理由一起删，留着会变成一条挂在没选中的场景
* 上的孤儿数据）；没选且还有名额就追加到末尾——追加而不是插入，是为了让
* must_1/2/3 的顺序等于点选顺序。
*/
function togglePick(state, no) {
	if (state.picks.includes(no)) {
		const reasons = { ...state.reasons };
		delete reasons[no];
		return {
			...state,
			picks: state.picks.filter((x) => x !== no),
			reasons
		};
	}
	if (picksLeft(state) <= 0) return state;
	return {
		...state,
		picks: [...state.picks, no]
	};
}
function loadState() {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed?.v !== 4 || !Array.isArray(parsed.order)) return null;
		if (!Array.isArray(parsed.picks)) return null;
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
/**
* 服务端快照：原始卡序、进度为零的一局。
*
* 之前这里返回 undefined，页面据此渲染一句「正在准备…」。结果是 SSR 出来的
* HTML 里一张卡都没有，**只要 JS 因为任何原因没跑起来或者跑挂了，用户看到的
* 就是一块空壳**。这一页是要发到微信群里给几十号人打开的，机型、浏览器、
* 各种插件都不可控，不能把「屏幕上有没有东西」这件事押在 JS 一定能跑通上。
*
* 卡序确实必须在客户端随机（SSR 定死了 hydrate 会对不上），但「先按原始顺序
* 渲染第一张真卡、hydrate 之后再换成打乱的那张」是完全可行的：多下一张海报，
* 换来 JS 挂掉时页面上仍然有完整的一张卡可看。
*
* 两条硬性约束：
*   · 必须是模块级常量。getServerSnapshot 每次都得返回同一个引用，
*     否则 React 判定快照一直在变，直接死循环重渲。
*   · 里面不能有 Date.now() / 随机数这类两端算不出同一个值的东西，
*     否则 hydrate 时又对不上。startedAt 和 clientId 因此是占位值——
*     这一份状态只用于渲染，永远不会被提交。
*/
var SSR_STATE = {
	v: 4,
	role: "",
	order: scenes.map((s) => s.no),
	cursor: 0,
	choices: {},
	picks: [],
	reasons: {},
	startedAt: 0,
	finishedAt: null,
	clientId: ""
};
/** undefined 表示还没在浏览器里取过快照。 */
var cached;
var listeners = /* @__PURE__ */ new Set();
function subscribeVote(onChange) {
	listeners.add(onChange);
	return () => {
		listeners.delete(onChange);
	};
}
/**
* 没有存档就地开一局。开场页已经去掉了，打开就得有第一张卡，而卡序又必须在
* 客户端才能定（随机的，SSR 定下来 hydrate 会对不上），所以只能在这里生成。
*
* 这里不落盘：只是打开看一眼就走的人不该在本机留下一局空进度，
* 也不该占掉一个 client_id。第一次划卡时 writeVote 会把它整个存下来。
*
* getSnapshot 必须每次返回同一个引用，否则 React 会判定快照一直在变而死循环，
* 所以 shuffle 的结果只算一次，之后一律走 cached。
*/
function readVote() {
	if (cached === void 0) cached = loadState() ?? createState();
	return cached ?? (cached = createState());
}
/**
* 服务端、以及客户端 hydrate 的那一帧，都走这里——React 用它渲染出和服务端
* 完全一致的树，之后才切到 readVote 的真实快照。
*
* 因为返回的是同一个常量引用，`state !== SSR_STATE` 就是一个免费的
* 「hydrate 完成了没有」判据，不需要再为此加一个 useState + useEffect。
*/
function readVoteOnServer() {
	return SSR_STATE;
}
/** 传 null = 清掉这一局；下一次 readVote 会就地开新的一局。 */
function writeVote(next) {
	cached = typeof next === "function" ? next(readVote()) : next;
	saveState(cached);
	for (const onChange of listeners) onChange();
}
var pad2$2 = (n) => String(n).padStart(2, "0");
/** 本地时区的 "YYYY-MM-DD HH:mm:ss"。用字符串而不是时间戳，是为了让多维表格
*  那一列可以直接建成文本，不用管时区解析。 */
function localStamp(ms) {
	const d = new Date(ms);
	return `${d.getFullYear()}-${pad2$2(d.getMonth() + 1)}-${pad2$2(d.getDate())} ${pad2$2(d.getHours())}:${pad2$2(d.getMinutes())}:${pad2$2(d.getSeconds())}`;
}
/** 「09 AI老人守护」——编号在前，表格里一眼能对上海报。 */
var label = (no) => `${pad2$2(no)} ${sceneOf(no).name}`;
function buildPayload(state, now = Date.now()) {
	const likes = likeList(state);
	const picks = pickList(state);
	const end = state.finishedAt ?? now;
	const payload = {
		role: roleLabel(state.role),
		submitted_at: localStamp(now),
		duration_seconds: Math.max(0, Math.round((end - state.startedAt) / 1e3)),
		like_count: likes.length,
		like_nos: likes.map(pad2$2).join(","),
		like_names: likes.map((no) => sceneOf(no).name).join("、"),
		must_nos: picks.map(pad2$2).join(","),
		must_1: "",
		reason_1: "",
		must_2: "",
		reason_2: "",
		must_3: "",
		reason_3: "",
		client_id: state.clientId
	};
	for (let i = 0; i < 3; i++) {
		const no = picks[i];
		const slot = i + 1;
		payload[`must_${slot}`] = no === void 0 ? "" : label(no);
		payload[`reason_${slot}`] = no === void 0 ? "" : state.reasons[no] ?? "";
	}
	return payload;
}
//#endregion
//#region app/components/vote-copy.ts
/**
* 投票页会打散原页面的宝宝/奶奶/爸妈/全家分组，因此只在这里补足脱离分组后
* 不明确的主语或宾语。全局场景文案仍与完整版海报保持一致。
*/
var VOTE_COPY_OVERRIDES = {
	1: { claim: "爸妈终于能睡个好觉了" },
	4: {
		claim: "爸妈上班也不错过",
		problemDetail: "宝宝第一次撑爬、开心大笑、认真吃饭，爸妈都没能亲眼看到",
		answerDetail: "宝宝哭闹、欢笑、撑爬、吃饭的瞬间，自动整理并同步微信"
	},
	5: { claim: "老人忘了吃药就提醒" },
	7: { claim: "奶奶在家学唱京剧" },
	8: { claim: "长辈不对劲，家人早知道" },
	9: { claim: "老人摔倒马上叫人" },
	15: { claim: "宠物拆家及时制止" },
	16: {
		claim: "听懂宠物想干嘛",
		problemTitle: "宠物一直叫，到底想干嘛",
		answerTitle: "结合叫声和行为，越看越懂宠物"
	},
	17: { claim: "变天前提醒家人收衣被" },
	19: { claim: "家里有危险立即报警" }
};
function getVoteCopy(scene) {
	const override = VOTE_COPY_OVERRIDES[scene.no];
	return {
		claim: override?.claim ?? scene.claim,
		problemTitle: override?.problemTitle ?? scene.problem.title,
		problemDetail: override?.problemDetail ?? scene.problem.detail,
		answerTitle: override?.answerTitle ?? scene.answer.title,
		answerDetail: override?.answerDetail ?? scene.answer.detail
	};
}
//#endregion
//#region app/components/vote-identity.ts
var AUTHORIZE_URL = "https://accounts.feishu.cn/open-apis/authen/v1/authorize";
var OAUTH_SESSION_KEY = "a100.vote.feishu-oauth.v1";
var OAUTH_MAX_AGE_MS = 600 * 1e3;
var base64Url = (bytes) => {
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return window.btoa(binary).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/u, "");
};
function createOAuthState() {
	const bytes = new Uint8Array(24);
	globalThis.crypto.getRandomValues(bytes);
	return base64Url(bytes);
}
function buildFeishuAuthorizeUrl({ appId, redirectUri, scope, state }) {
	const url = new URL(AUTHORIZE_URL);
	url.searchParams.set("client_id", appId);
	url.searchParams.set("redirect_uri", redirectUri);
	url.searchParams.set("response_type", "code");
	if (scope.trim()) url.searchParams.set("scope", scope.trim());
	url.searchParams.set("state", state);
	return url.toString();
}
function currentAppId() {
	if (!["127.0.0.1", "localhost"].includes(window.location.hostname)) return isFeishuIdentityEnabled() ? FEISHU_APP_ID : "";
	try {
		const local = window.sessionStorage.getItem("a100.vote.test.feishu-app-id") ?? "";
		return /^cli_[A-Za-z0-9]+$/.test(local) ? local : "";
	} catch {
		return "";
	}
}
/**
* 只在用户点「提交」之后才发起授权。这样 code 回来后立刻送给飞书自动化，不会
* 因为用户看 19 张卡花了太久而过期。
*/
function beginFeishuAuthorization() {
	const appId = currentAppId();
	if (!appId) return { kind: "disabled" };
	try {
		const state = createOAuthState();
		const intent = {
			state,
			createdAt: Date.now()
		};
		window.sessionStorage.setItem(OAUTH_SESSION_KEY, JSON.stringify(intent));
		const url = buildFeishuAuthorizeUrl({
			appId,
			redirectUri: FEISHU_OAUTH_REDIRECT_URI,
			scope: "",
			state
		});
		window.location.assign(url);
		return { kind: "redirecting" };
	} catch {
		return {
			kind: "error",
			message: "无法保存飞书授权状态，请检查浏览器隐私设置后重试"
		};
	}
}
function removeOAuthQuery() {
	try {
		const url = new URL(window.location.href);
		for (const key of [
			"code",
			"state",
			"error",
			"error_description"
		]) url.searchParams.delete(key);
		const clean = `${url.pathname}${url.search}${url.hash}`;
		window.history.replaceState(window.history.state, "", clean);
	} catch {}
}
function loadIntent() {
	try {
		const raw = window.sessionStorage.getItem(OAUTH_SESSION_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed.state !== "string" || typeof parsed.createdAt !== "number") return null;
		return {
			state: parsed.state,
			createdAt: parsed.createdAt
		};
	} catch {
		return null;
	}
}
/**
* 授权码只从 URL 读进内存，随后立即清理 URL 和 sessionStorage。它不会进入投票
* state、收据或复制结果；真正发送时也只作为一次性的 webhook 临时字段。
*/
function consumeFeishuCallback() {
	const url = new URL(window.location.href);
	const code = url.searchParams.get("code");
	const returnedState = url.searchParams.get("state");
	const error = url.searchParams.get("error");
	const description = url.searchParams.get("error_description");
	if (!code && !error) return { kind: "none" };
	const intent = loadIntent();
	try {
		window.sessionStorage.removeItem(OAUTH_SESSION_KEY);
	} catch {}
	removeOAuthQuery();
	if (error) return {
		kind: "error",
		message: description || "飞书身份确认未完成"
	};
	if (!intent || !returnedState || returnedState !== intent.state) return {
		kind: "error",
		message: "飞书身份确认状态不匹配，请重新提交"
	};
	if (Date.now() - intent.createdAt > OAUTH_MAX_AGE_MS) return {
		kind: "error",
		message: "飞书身份确认已超时，请重新提交"
	};
	if (!code) return {
		kind: "error",
		message: "飞书没有返回授权码，请重新提交"
	};
	return {
		kind: "success",
		code
	};
}
var feishuIdentityEnabled = () => currentAppId() !== "";
//#endregion
//#region app/components/vote-submit.ts
/**
* 把一份投票结果送到飞书多维表格的 webhook。
*
* 站点没有后端，飞书端点又不返回 Access-Control-Allow-Origin，所以这里只发
* 一次 no-cors + text/plain 请求。响应会是 opaque，浏览器不能读状态码或正文：
* fetch 没有 reject 就按「已送达」处理；reject 时保留本地结果，让用户复制提交。
*/
function buildWirePayload(payload, identity) {
	if (!identity) return payload;
	return {
		...payload,
		identity_status: identity.status,
		feishu_auth_code: identity.status === "pending" ? identity.authCode : ""
	};
}
/** 提交结果单独落一份盘。链路走到哪一档都写，用户清了进度也还能找回来重发。 */
function saveReceipt(payload, result, identity) {
	try {
		window.localStorage.setItem(RECEIPT_KEY, JSON.stringify({
			at: Date.now(),
			result,
			payload,
			identity: identity ? { status: identity.status } : void 0
		}));
	} catch {}
}
async function submitVote(payload, identity) {
	saveReceipt(payload, {
		ok: false,
		via: "manual",
		message: "结果已保存在本机",
		detail: "正在尝试发送；如果网络请求失败，可以复制结果手工提交。"
	}, identity);
	if (isLocalMode()) {
		const result = {
			ok: true,
			via: "local",
			message: "已保存到本机（本地模式）",
			detail: "app/vote-config.ts 里的 FEISHU_WEBHOOK_URL 还是空的，没有发出任何网络请求。"
		};
		saveReceipt(payload, result, identity);
		return result;
	}
	const url = FEISHU_WEBHOOK_URL.trim();
	const wirePayload = buildWirePayload(payload, identity);
	try {
		await fetch(url, {
			method: "POST",
			mode: "no-cors",
			headers: { "Content-Type": "text/plain;charset=UTF-8" },
			body: JSON.stringify(wirePayload),
			keepalive: true
		});
		const result = {
			ok: true,
			via: "no-cors",
			message: "已送达飞书",
			detail: "请求已完成且没有被浏览器拒绝。no-cors 响应是 opaque，浏览器无法读取状态码；完整结果也已保存在本机。"
		};
		saveReceipt(payload, result, identity);
		return result;
	} catch (err) {
		const result = {
			ok: false,
			via: "manual",
			message: "发送失败，结果已保存在本机",
			detail: `请求被浏览器拒绝，通常是断网或所在网络拦截了 webhook。请用下面的「复制结果」手工提交。错误：${err instanceof Error ? `${err.name}: ${err.message}` : String(err)}`
		};
		saveReceipt(payload, result, identity);
		return result;
	}
}
//#endregion
//#region app/components/vote-result.tsx
var import_jsx_runtime = require_jsx_runtime();
var pad2$1 = (n) => String(n).padStart(2, "0");
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
	const [thanksOpen, setThanksOpen] = (0, import_react.useState)(false);
	const [roleError, setRoleError] = (0, import_react.useState)("");
	const [identityError, setIdentityError] = (0, import_react.useState)("");
	const firstRoleRef = (0, import_react.useRef)(null);
	const thanksButtonRef = (0, import_react.useRef)(null);
	const successRef = (0, import_react.useRef)(null);
	const callbackHandledRef = (0, import_react.useRef)(false);
	const likes = (0, import_react.useMemo)(() => likeList(state), [state]);
	const picks = (0, import_react.useMemo)(() => pickList(state), [state]);
	const left = picksLeft(state);
	const payload = (0, import_react.useMemo)(() => buildPayload(state), [state]);
	const json = (0, import_react.useMemo)(() => JSON.stringify(payload, null, 2), [payload]);
	const identityEnabled = feishuIdentityEnabled();
	const closeThanks = (0, import_react.useCallback)(() => {
		setThanksOpen(false);
		successRef.current?.focus();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!thanksOpen) return;
		thanksButtonRef.current?.focus();
		const onKeyDown = (event) => {
			if (event.key !== "Escape") return;
			event.preventDefault();
			closeThanks();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [closeThanks, thanksOpen]);
	const finishSend = (0, import_react.useCallback)(async (identity) => {
		setSending(true);
		const next = await submitVote(payload, identity);
		setResult(next);
		setSending(false);
		if (next.ok) setThanksOpen(true);
	}, [payload]);
	(0, import_react.useEffect)(() => {
		if (!identityEnabled || callbackHandledRef.current) return;
		const timer = window.setTimeout(() => {
			const callback = consumeFeishuCallback();
			if (callback.kind === "none") return;
			callbackHandledRef.current = true;
			if (callback.kind === "error") {
				setIdentityError(callback.message);
				return;
			}
			if (!state.role) {
				setRoleError("请选择角色后提交");
				firstRoleRef.current?.focus();
				return;
			}
			setIdentityError("");
			finishSend({
				status: "pending",
				authCode: callback.code
			});
		}, 0);
		return () => window.clearTimeout(timer);
	}, [
		finishSend,
		identityEnabled,
		state.role
	]);
	const send = async () => {
		if (!state.role) {
			setRoleError("请选择角色后提交");
			firstRoleRef.current?.focus();
			return;
		}
		setRoleError("");
		setIdentityError("");
		if (identityEnabled) {
			const authorization = beginFeishuAuthorization();
			if (authorization.kind === "redirecting") return;
			if (authorization.kind === "error") {
				setIdentityError(authorization.message);
				return;
			}
		}
		await finishSend();
	};
	const copy = async () => {
		setCopied(await copyText(json) ? "结果已复制" : "复制失败，请允许浏览器使用剪贴板后重试；结果仍已保存在本机。");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "vote-result",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "vote-picker",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "vote-picker-title",
					children: ["哪 3 个是必须做的", likes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["还可选 ", left] })]
				}), likes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "vote-empty",
					children: "这一轮没有心动的场景，选好角色即可提交。"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "vote-pick-list",
					children: likes.map((no) => {
						const scene = sceneOf(no);
						const copy = getVoteCopy(scene);
						const rank = picks.indexOf(no);
						const chosen = rank >= 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: chosen ? "vote-pick is-on" : "vote-pick",
							disabled: !chosen && left <= 0,
							"aria-pressed": chosen,
							onClick: () => writeVote((prev) => togglePick(prev, no)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "vote-pick-rank",
								"aria-hidden": "true",
								children: chosen ? rank + 1 : ""
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "vote-pick-text",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: pad2$1(scene.no) }), scene.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: copy.claim })]
							})]
						}), chosen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "vote-why",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["为什么？", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "选填" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: state.reasons[no] ?? "",
								maxLength: 60,
								placeholder: "一句话就行，可以跳过",
								onChange: (e) => {
									const text = e.target.value;
									writeVote((prev) => ({
										...prev,
										reasons: {
											...prev.reasons,
											[no]: text
										}
									}));
								}
							})]
						})] }, no);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "vote-submit",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "vote-roles",
						disabled: result?.ok === true,
						role: "radiogroup",
						"aria-labelledby": "vote-role-legend",
						"aria-required": "true",
						"aria-invalid": roleError ? "true" : void 0,
						"aria-describedby": roleError ? "vote-role-error" : void 0,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
								id: "vote-role-legend",
								children: ["你的角色", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "必选，用来分组看分歧" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "vote-role-grid",
								children: ROLES.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: state.role === item.id ? "vote-role is-active" : "vote-role",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: index === 0 ? firstRoleRef : void 0,
										type: "radio",
										name: "role",
										value: item.id,
										checked: state.role === item.id,
										required: true,
										"aria-describedby": roleError ? "vote-role-error" : void 0,
										onChange: () => {
											setRoleError("");
											writeVote((prev) => ({
												...prev,
												role: item.id
											}));
										}
									}), item.label]
								}, item.id))
							}),
							roleError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								id: "vote-role-error",
								className: "vote-role-error",
								role: "alert",
								children: roleError
							})
						]
					}),
					result === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						identityEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "vote-identity-note",
							children: "提交时将通过飞书确认身份，仅记录姓名和应用内 ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "vote-send",
							onClick: send,
							disabled: sending,
							"aria-describedby": identityError ? "vote-identity-error" : void 0,
							children: sending ? "提交中…" : identityEnabled ? "通过飞书确认并提交" : "提交我的选择"
						}),
						identityError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							id: "vote-identity-error",
							className: "vote-identity-error",
							role: "alert",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: identityError }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vote-ghost",
								disabled: sending,
								onClick: () => {
									setIdentityError("");
									finishSend({ status: "anonymous" });
								},
								children: "匿名提交"
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						ref: result.ok ? successRef : void 0,
						tabIndex: result.ok ? -1 : void 0,
						className: result.ok ? "vote-outcome is-ok" : "vote-outcome is-bad",
						children: [
							result.ok ? "✓" : "!",
							" ",
							result.message
						]
					}), !result.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "vote-submit-note",
							children: "请检查网络后重试；也可以复制结果发给投票发起人。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "vote-submit-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vote-ghost",
								onClick: send,
								children: "再试一次"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "vote-ghost",
								onClick: copy,
								children: "复制结果"
							})]
						}),
						copied && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "vote-copied",
							role: "status",
							children: copied
						})
					] })] }),
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
			}),
			thanksOpen && result?.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vote-thanks-backdrop",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "vote-thanks-dialog",
					role: "dialog",
					"aria-modal": "true",
					"aria-labelledby": "vote-thanks-title",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "vote-thanks-stars",
							"aria-hidden": "true",
							children: Array.from({ length: 8 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}, index))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "vote-thanks-title",
							children: "感谢参与，投票已收到"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							ref: thanksButtonRef,
							type: "button",
							className: "vote-thanks-accept",
							onClick: closeThanks,
							children: "完成"
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region app/components/vote-app.tsx
/** 左右判定：卡片宽度的 25%。Tinder 系产品的通行手感，一屏内划过约四分之一。 */
var H_RATIO = .25;
var H_MIN = 72;
/**
* 甩动逃生阀。松手瞬间速度超过 0.55 px/ms（约 550px/s）就直接判定，不看位移，
* 否则「快速轻甩」这个最自然的动作会因为位移不够而被弹回来，手感立刻就假了。
* 配一个 24px 的最小位移，避免点按时的手指抖动被当成甩动。
*/
var FLICK_V = .55;
var FLICK_MIN_PX = 24;
/** 跟手旋转的最大角度。 */
var MAX_TILT = 14;
/** 飞出动画时长，和 CSS 里的 transition 对齐。 */
var EXIT_MS = 300;
var SNAP_MS = 260;
/** 同时挂在 DOM 上的卡片数。再多也看不见，只是白白多下载几张图。 */
var STACK = 3;
var INTRO_SECONDS = 5;
var INTRO_SEEN_KEY = "a100.vote.intro.seen.v1";
var clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
var pad2 = (n) => String(n).padStart(2, "0");
function VoteApp() {
	const state = (0, import_react.useSyncExternalStore)(subscribeVote, readVote, readVoteOnServer);
	const hydrated = state !== SSR_STATE;
	const [introDismissed, setIntroDismissed] = (0, import_react.useState)(false);
	const [introSeconds, setIntroSeconds] = (0, import_react.useState)(INTRO_SECONDS);
	const showIntro = (0, import_react.useMemo)(() => {
		if (!hydrated || false) return false;
		const forced = new URLSearchParams(window.location.search).get("intro") === "1";
		const hasProgress = state.cursor > 0 || Object.keys(state.choices).length > 0 || state.finishedAt !== null || isFinished(state);
		if (forced) return true;
		if (hasProgress) return false;
		try {
			return window.sessionStorage.getItem(INTRO_SEEN_KEY) !== "1";
		} catch {
			return true;
		}
	}, [hydrated, state]) && !introDismissed;
	const beginVoting = (0, import_react.useCallback)(() => setIntroDismissed(true), []);
	(0, import_react.useEffect)(() => {
		if (!showIntro) return;
		try {
			window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
		} catch {}
		const startedAt = Date.now();
		const ticker = window.setInterval(() => {
			const elapsed = Math.floor((Date.now() - startedAt) / 1e3);
			setIntroSeconds(Math.max(1, INTRO_SECONDS - elapsed));
		}, 200);
		const timer = window.setTimeout(beginVoting, INTRO_SECONDS * 1e3);
		return () => {
			window.clearInterval(ticker);
			window.clearTimeout(timer);
		};
	}, [beginVoting, showIntro]);
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
	/** 两枚印章的强度，0=看不见，1=已经越过判定线。 */
	const setStamps = (el, like, nope) => {
		el.style.setProperty("--like", String(like));
		el.style.setProperty("--nope", String(nope));
	};
	const paint = (0, import_react.useCallback)((dx, dy) => {
		const el = cardRef.current;
		if (!el) return;
		const w = el.offsetWidth || 320;
		const tilt = clamp(dx / w * MAX_TILT * 2, -MAX_TILT, MAX_TILT);
		el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${tilt}deg)`;
		const hT = Math.max(H_MIN, w * H_RATIO);
		setStamps(el, clamp(dx / hT, 0, 1), clamp(-dx / hT, 0, 1));
	}, []);
	const snapBack = (0, import_react.useCallback)(() => {
		const el = cardRef.current;
		if (!el) return;
		el.classList.add("is-settling");
		el.style.transition = `transform ${SNAP_MS}ms cubic-bezier(.2,.9,.3,1)`;
		el.style.transform = "translate3d(0,0,0) rotate(0deg)";
		setStamps(el, 0, 0);
	}, []);
	/** 把选择写进状态，并把卡序推进一张。 */
	const applyChoice = (0, import_react.useCallback)((no, choice) => {
		writeVote((prev) => {
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
		if (busy.current || isFinished(state)) return;
		const no = state.order[state.cursor];
		busy.current = true;
		const el = cardRef.current;
		if (el) {
			el.classList.add("is-settling");
			setStamps(el, choice === "like" ? 1 : 0, choice === "pass" ? 1 : 0);
			const w = el.offsetWidth || 320;
			el.style.transition = `transform ${EXIT_MS}ms cubic-bezier(.3,.6,.4,1), opacity ${EXIT_MS}ms linear`;
			el.style.transform = `translate3d(${choice === "like" ? w * 1.6 : -w * 1.6}px, 40px, 0) rotate(${choice === "like" ? MAX_TILT + 6 : -MAX_TILT - 6}deg)`;
			el.style.opacity = "0";
		}
		window.setTimeout(() => {
			applyChoice(no, choice);
			busy.current = false;
		}, EXIT_MS);
	}, [state, applyChoice]);
	const onPointerDown = (event) => {
		if (busy.current) return;
		if (event.pointerType === "mouse" && event.button !== 0) return;
		const el = cardRef.current;
		if (!el) return;
		el.setPointerCapture(event.pointerId);
		el.classList.remove("is-settling");
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
		const w = cardRef.current?.offsetWidth || 320;
		const hT = Math.max(H_MIN, w * H_RATIO);
		const flickX = performance.now() - d.lt < 120 && Math.abs(d.vx) > FLICK_V && Math.abs(dx) > FLICK_MIN_PX;
		if (dx > hT || flickX && d.vx > 0) commit("like");
		else if (-dx > hT || flickX && d.vx < 0) commit("pass");
		else snapBack();
	};
	const deckActive = !showIntro && !isFinished(state);
	(0, import_react.useEffect)(() => {
		if (!deckActive) return;
		const onKey = (event) => {
			const target = event.target;
			if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
			if (event.key === "ArrowLeft") commit("pass");
			else if (event.key === "ArrowRight") commit("like");
			else return;
			event.preventDefault();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [deckActive, commit]);
	const undo = (0, import_react.useCallback)(() => {
		if (busy.current) return;
		writeVote((prev) => {
			if (prev.cursor === 0) return prev;
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
				picks: prev.picks.filter((x) => x !== no),
				finishedAt: null
			};
		});
	}, []);
	const restart = (0, import_react.useCallback)(() => writeVote(null), []);
	if (showIntro) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "vote-shell",
		"data-phase": "intro",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "vote-welcome",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vote-welcome-media",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					className: "vote-welcome-image",
					src: "/media/vote-welcome.webp",
					width: 1024,
					height: 787,
					alt: "红布覆盖的 A100 AI 家庭看护助手，等待揭晓"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "vote-welcome-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "vote-welcome-eyebrow",
						children: "A100 场景优先级投票"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "欢迎参与场景投票" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "vote-welcome-description",
						children: "左右滑动，选出你认为最有价值的场景"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "vote-welcome-progress",
						role: "progressbar",
						"aria-label": "自动开始倒计时",
						"aria-valuemin": 0,
						"aria-valuemax": INTRO_SECONDS,
						"aria-valuenow": INTRO_SECONDS - introSeconds,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "vote-welcome-countdown",
						role: "status",
						"aria-live": "polite",
						children: [introSeconds, " 秒后自动开始"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "vote-welcome-start",
						onClick: beginVoting,
						children: "立即开始"
					})
				]
			})]
		})
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
	const stack = state.order.slice(state.cursor, state.cursor + STACK);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "vote-shell",
		"data-phase": "deck",
		"data-hydrated": hydrated ? "1" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "vote-bar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "vote-bar-row",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "vote-progress",
						children: [
							"第 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: state.cursor + 1 }),
							" / ",
							TOTAL
						]
					})
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
					const copy = getVoteCopy(scene);
					const isTop = depth === 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "vote-card-slot",
						style: {
							"--depth": depth,
							zIndex: STACK - depth
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							ref: isTop ? cardRef : void 0,
							className: isTop ? "vote-card is-top" : "vote-card",
							onPointerDown: isTop ? onPointerDown : void 0,
							onPointerMove: isTop ? onPointerMove : void 0,
							onPointerUp: isTop ? endDrag : void 0,
							onPointerCancel: isTop ? endDrag : void 0,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
									className: "vote-card-titlebar",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "vote-title-rule",
											"aria-hidden": "true"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "vote-title-copy",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: scene.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: copy.claim })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "vote-title-rule",
											"aria-hidden": "true"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("picture", {
									className: "vote-card-media",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										className: "vote-card-poster",
										src: `/media/${scene.media}-1000.webp`,
										srcSet: `/media/${scene.media}-1000.webp 1000w, /media/${scene.media}-1500.webp 1500w`,
										sizes: "(min-width: 620px) 35rem, 100vw",
										width: 1e3,
										height: 442,
										alt: `${scene.name}｜左边是现在的情况，右边是 A100 的做法`,
										draggable: false
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "vote-card-body",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "vote-card-head",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "vote-card-no",
													children: pad2(scene.no)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: scene.name }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `scene-tag tag-${scene.group}`,
													children: groupLabel[scene.group]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "vote-card-claim",
											children: copy.claim
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
											className: "vote-card-compare",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "vote-cmp is-now",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "现在" }), copy.problemTitle] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: copy.problemDetail })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "vote-cmp is-a100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "A100" }), copy.answerTitle] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: copy.answerDetail })]
											})]
										})
									]
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
								})
							]
						})
					}, no);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "vote-actions",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "vote-action vote-action-undo",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "vote-btn vote-btn-undo",
							onClick: undo,
							disabled: state.cursor === 0,
							"aria-label": "撤销上一张",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconUndo, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "vote-action-label",
							children: "撤销"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "vote-action vote-action-pass",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "vote-btn vote-btn-pass",
							onClick: () => commit("pass"),
							"aria-label": "Pass，这一版可以先不做",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconX, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "vote-action-label",
							children: "Pass"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "vote-action vote-action-like",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "vote-btn vote-btn-like",
							onClick: () => commit("like"),
							"aria-label": "心动，这个场景值得做",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconHeart, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "vote-action-label",
							children: "心动"
						})]
					})
				]
			}),
			!hydrated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("noscript", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: ".vote-fallback.is-slow{display:none}" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "vote-fallback is-noscript",
				children: "浏览器禁用了 JavaScript：卡片可以照常看，但没法投票。 换微信、Safari 或 Chrome 打开这个链接就行。"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "vote-fallback is-slow",
				role: "status",
				children: "加载有点慢，刷新一下试试"
			})] })
		]
	});
}
var iconProps = {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2.2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": true,
	focusable: false
};
var IconUndo = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...iconProps,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 12a9 9 0 1 0 3.2-6.9L3 8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 3v5h5" })]
});
var IconX = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	...iconProps,
	strokeWidth: 2.6,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 6 6 18" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m6 6 12 12" })]
});
var IconHeart = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	...iconProps,
	fill: "currentColor",
	strokeWidth: 1.6,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" })
});
//#endregion
export { VoteApp };
