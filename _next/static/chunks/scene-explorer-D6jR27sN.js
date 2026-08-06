import { r as __toESM } from "./rolldown-runtime-DFEGrk7x.js";
import { i as require_jsx_runtime, r as require_react } from "./framework-CZh43tRa.js";
//#region app/data/scenes.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var groups = [
	{
		id: "baby",
		label: "宝宝",
		subtitle: "成长守护",
		accent: "#7fb5e6"
	},
	{
		id: "grandma",
		label: "奶奶",
		subtitle: "安心日常",
		accent: "#e0be80"
	},
	{
		id: "parents",
		label: "爸妈",
		subtitle: "省心生活",
		accent: "#cf8f6a"
	},
	{
		id: "family",
		label: "全家",
		subtitle: "安心后盾",
		accent: "#8fc4a8"
	}
];
var groupLabel = Object.fromEntries(groups.map((g) => [g.id, g.label]));
var scenes = [
	{
		no: 1,
		group: "baby",
		name: "AI夜间守护",
		claim: "终于能睡个好觉了",
		problem: {
			title: "白天上班，夜里带娃",
			detail: "父母一时睡熟，没发现被子已经盖住宝宝口鼻"
		},
		answer: {
			title: "蒙面立即报警",
			detail: "识别口鼻被遮挡，立即报警提醒父母"
		},
		note: "支持蒙面、呛奶、靠近床沿、翻越护栏等危险行为识别",
		media: "scene-night"
	},
	{
		no: 2,
		group: "baby",
		name: "AI磕碰预警",
		claim: "提前一步护住",
		problem: {
			title: "宝宝直接磕到桌角",
			detail: "额头撞上才哭，等看见时已经来不及"
		},
		answer: {
			title: "预测运动路线，提前提醒",
			detail: "判断即将磕碰，马上语音提醒家长"
		},
		media: "scene-climbguard"
	},
	{
		no: 3,
		group: "baby",
		name: "AI保姆看护",
		claim: "异常互动及时提醒",
		problem: {
			title: "宝宝交给保姆不放心",
			detail: "有没有耐心回应、是否出现粗暴动作，父母上班看不到"
		},
		answer: {
			title: "AI持续看护互动过程",
			detail: "哭闹无人回应、剧烈拉拽推搡等异常，立即通知父母"
		},
		media: "scene-nanny"
	},
	{
		no: 4,
		group: "baby",
		name: "AI成长记录",
		claim: "上班也不错过",
		problem: {
			title: "父母上班错过精彩瞬间",
			detail: "第一次撑爬、开心大笑、认真吃饭，都没能亲眼看到"
		},
		answer: {
			title: "AI主动记录成长日常",
			detail: "哭闹、欢笑、撑爬、吃饭，自动整理并同步微信"
		},
		media: "scene-growth"
	},
	{
		no: 5,
		group: "grandma",
		name: "AI吃药守护",
		claim: "忘了就提醒",
		problem: {
			title: "老人经常忘记吃药",
			detail: "家人不在身边，错过时间也不知道"
		},
		answer: {
			title: "到点主动确认",
			detail: "先提醒老人，未确认再通知家人"
		},
		media: "scene-medicine"
	},
	{
		no: 6,
		group: "grandma",
		name: "AI用药助手",
		claim: "拿起药就能问",
		problem: {
			title: "药盒小字看不清",
			detail: "「这个药一次吃几片？」自己翻说明书费劲"
		},
		answer: {
			title: "对着药盒问，马上说明白",
			detail: "「药盒标注：一次 1 片；请按医嘱服用」"
		},
		media: "scene-medhelp"
	},
	{
		no: 7,
		group: "grandma",
		name: "AI京剧陪练",
		claim: "在家学唱京剧",
		problem: {
			title: "一个人学，唱腔动作没把握",
			detail: "调门准不准、手势对不对，没人及时提醒"
		},
		answer: {
			title: "边唱边练，随时出声指导",
			detail: "「这一句尾音再收稳，兰花指再抬高一点」"
		},
		media: "scene-opera"
	},
	{
		no: 8,
		group: "grandma",
		name: "AI植物养护",
		claim: "君子兰缺水会提醒",
		problem: {
			title: "给花浇水全凭想起来",
			detail: "不是忘了浇，就是家里人重复浇"
		},
		answer: {
			title: "该浇水时主动提醒",
			detail: "识别叶片状态，提醒家人及时浇水"
		},
		media: "scene-plant"
	},
	{
		no: 9,
		group: "grandma",
		name: "AI老人守护",
		claim: "摔倒马上叫人",
		problem: {
			title: "老人独自在家摔倒",
			detail: "手机不在身边，家人很久以后才知道"
		},
		answer: {
			title: "发现倒地立即询问",
			detail: "持续无人回应，马上联系预设家人"
		},
		media: "scene-elder"
	},
	{
		no: 10,
		group: "parents",
		name: "AI视觉盯锅",
		claim: "到点主动提醒",
		problem: {
			title: "做饭还得自己记时间",
			detail: "锅在火上，忙起来就容易忘记"
		},
		answer: {
			title: "看见下锅自动计时",
			detail: "时间一到，主动提醒关火出锅"
		},
		media: "scene-cooking"
	},
	{
		no: 11,
		group: "parents",
		name: "AI做菜辅助",
		claim: "新菜也敢放手做",
		problem: {
			title: "第一次做新菜，调味没底",
			detail: "番茄浓汤牛腩该放多少糖？边做边查，手忙脚乱"
		},
		answer: {
			title: "开口一问，直接告诉你",
			detail: "「这锅先放 1 茶匙糖，尝味后再调整」"
		},
		media: "scene-cookassist"
	},
	{
		no: 12,
		group: "parents",
		name: "AI离家巡检",
		claim: "出门不再折返",
		problem: {
			title: "进了电梯还在担心",
			detail: "门没锁、空调没关，只能回家检查"
		},
		answer: {
			title: "全屋状态一次确认",
			detail: "门锁、门窗、家电，出门自动检查"
		},
		media: "scene-away"
	},
	{
		no: 13,
		group: "parents",
		name: "AI视觉找物",
		claim: "一句话找到手机 / 钥匙",
		problem: {
			title: "手机遥控器又不见了",
			detail: "沙发、茶几、卧室，满屋反复翻找"
		},
		answer: {
			title: "问一句就能找到",
			detail: "「遥控器最后放在沙发右边了」"
		},
		media: "scene-find"
	},
	{
		no: 14,
		group: "parents",
		name: "AI出门提醒",
		claim: "忘带东西会叫你",
		problem: {
			title: "出门总是丢三落四",
			detail: "到了楼下才发现钥匙、工牌没带"
		},
		answer: {
			title: "走到门口主动提醒",
			detail: "「你的工牌还放在茶几上」"
		},
		media: "scene-leaving"
	},
	{
		no: 15,
		group: "family",
		name: "AI宠物看护",
		claim: "拆家及时制止",
		problem: {
			title: "宠物独自在家，就怕拆家",
			detail: "翻垃圾、咬家具、上餐桌，回家才发现一片狼藉"
		},
		answer: {
			title: "拆家刚有苗头，马上叫停",
			detail: "AI 现场语音制止，同时通知主人"
		},
		media: "scene-pet"
	},
	{
		no: 16,
		group: "family",
		name: "AI远程看宠",
		claim: "上班也能看看它",
		problem: {
			title: "人在公司，心还惦记着它",
			detail: "今天乖不乖、有没有好好吃饭，只能靠猜"
		},
		answer: {
			title: "打开 App，马上看到",
			detail: "主人主动查看才连接画面，日常识别仍在本地完成"
		},
		media: "scene-remotepet"
	},
	{
		no: 17,
		group: "family",
		name: "AI宠物互动",
		claim: "听懂它想干嘛",
		problem: {
			title: "它一直叫，到底想干嘛",
			detail: "饿了、无聊、想出去，家人只能靠猜"
		},
		answer: {
			title: "叫声 + 行为，越看越懂它",
			detail: "「在阳台门口短叫又扒门，是想出去晒太阳」"
		},
		media: "scene-pettalk"
	},
	{
		no: 18,
		group: "family",
		name: "AI晾晒提醒",
		claim: "变天前叫你收",
		problem: {
			title: "衣服被子还晾在阳台",
			detail: "乌云来了没人留意，一场雨就白晒"
		},
		answer: {
			title: "天气 + 阳台画面综合判断",
			detail: "确认将下雨且衣被未收，立即提醒家人"
		},
		media: "scene-laundry"
	},
	{
		no: 19,
		group: "family",
		name: "AI异常巡查",
		claim: "有动静主动告诉你",
		problem: {
			title: "夜里有动静，家人毫不知情",
			detail: "一只老鼠多次从阳台进入，又钻到客厅沙发下"
		},
		answer: {
			title: "第二天主动提醒，位置说清楚",
			detail: "「昨晚发现 1 只老鼠，多次出入阳台和沙发下」"
		},
		note: "老鼠只是其中一例，家里其他异常动静同样会记录并提醒",
		media: "scene-mousealert"
	},
	{
		no: 20,
		group: "family",
		name: "AI家庭巡防",
		claim: "有危险立即报警",
		problem: {
			title: "家里没人，风险无人发现",
			detail: "出现火苗、门窗异常，往往出事后才知道"
		},
		answer: {
			title: "摄像头持续看护",
			detail: "发现火苗或门窗异常，立即报警并通知家人"
		},
		media: "scene-patrol"
	}
];
//#endregion
//#region app/components/poster-viewer.tsx
var import_jsx_runtime = require_jsx_runtime();
/** 触发翻页所需的最小水平滑动距离（px） */
var SWIPE_THRESHOLD = 48;
/**
* 全屏海报查看器。
*
* 海报是 16:9 的「左问题 / 右方案」对照图，竖屏手机上直接看只有约 200px 高，
* 图里烤进去的说明文字小到无法辨认。这里在竖屏时把图旋转 90° 铺满屏幕，
* 可视面积约为原来的 4 倍。用户也可以手动切回竖看。
*/
function PosterViewer({ scenes, index, onClose, onIndexChange }) {
	const scene = scenes[index];
	const [viewport, setViewport] = (0, import_react.useState)({
		w: 0,
		h: 0
	});
	const [rotateOverride, setRotateOverride] = (0, import_react.useState)(null);
	const rootRef = (0, import_react.useRef)(null);
	const closeRef = (0, import_react.useRef)(null);
	const hasPrev = index > 0;
	const hasNext = index < scenes.length - 1;
	const go = (0, import_react.useCallback)((delta) => {
		const next = index + delta;
		if (next < 0 || next >= scenes.length) return;
		onIndexChange(next);
	}, [
		index,
		scenes.length,
		onIndexChange
	]);
	(0, import_react.useEffect)(() => {
		const measure = () => setViewport({
			w: window.innerWidth,
			h: window.innerHeight
		});
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, []);
	(0, import_react.useEffect)(() => {
		closeRef.current?.focus();
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (event) => {
			if (event.key === "Escape") onClose();
			if (event.key === "ArrowRight") go(1);
			if (event.key === "ArrowLeft") go(-1);
		};
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", onKey);
		};
	}, [onClose, go]);
	(0, import_react.useEffect)(() => {
		const node = rootRef.current;
		if (!node) return;
		let start = null;
		const onStart = (event) => {
			const touch = event.touches[0];
			start = {
				x: touch.clientX,
				y: touch.clientY
			};
		};
		const onEnd = (event) => {
			if (!start) return;
			const touch = event.changedTouches[0];
			const dx = touch.clientX - start.x;
			const dy = touch.clientY - start.y;
			start = null;
			if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
			go(dx < 0 ? 1 : -1);
		};
		node.addEventListener("touchstart", onStart, { passive: true });
		node.addEventListener("touchend", onEnd, { passive: true });
		return () => {
			node.removeEventListener("touchstart", onStart);
			node.removeEventListener("touchend", onEnd);
		};
	}, [go]);
	const autoRotate = viewport.w > 0 && viewport.w < 820 && viewport.h > viewport.w;
	const rotated = rotateOverride ?? autoRotate;
	const frame = rotated ? {
		width: viewport.h,
		height: viewport.w
	} : {
		width: viewport.w,
		height: viewport.h
	};
	const hint = !hasNext ? `已看完全部 ${scenes.length} 个场景` : hasPrev ? "左右滑动切换场景" : "向左滑动看下一个";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "viewer",
		role: "dialog",
		"aria-modal": "true",
		"aria-label": `${scene.name}场景海报`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "viewer-backdrop",
				onClick: onClose,
				"aria-label": "关闭海报"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "viewer-bar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "viewer-count",
					children: [
						String(scene.no).padStart(2, "0"),
						" /",
						" ",
						String(scenes.length).padStart(2, "0"),
						" · ",
						scene.name
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "viewer-actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "viewer-btn",
						onClick: () => setRotateOverride(!rotated),
						"aria-pressed": rotated,
						children: rotated ? "竖看" : "横看"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						ref: closeRef,
						type: "button",
						className: "viewer-btn viewer-close",
						onClick: onClose,
						children: "关闭"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: rotated ? "viewer-stage is-rotated" : "viewer-stage",
				style: {
					width: frame.width,
					height: frame.height
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: `/media/${scene.media}-full.webp`,
					alt: `${scene.name}：左侧为${scene.problem.title}，右侧为${scene.answer.title}`,
					decoding: "async"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "viewer-foot",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "viewer-btn",
						onClick: () => go(-1),
						disabled: !hasPrev,
						children: "上一个"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "viewer-hint",
						children: hint
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "viewer-btn",
						onClick: () => go(1),
						disabled: !hasNext,
						children: "下一个"
					})
				]
			})
		]
	});
}
//#endregion
//#region app/components/scene-explorer.tsx
var filters = groups.map((g) => ({
	id: g.id,
	label: g.label,
	sub: g.subtitle
}));
/**
* 简版 /gallery 与完整版 / 是同一个页面，差别只在场景卡片：简版把海报当成品
* 用，卡片上只留编号和分组标签，场景名、副标题、对照文案、补充说明一律不渲染。
*
* 图也跟着换档：完整版用 prepare-media.mjs 裁掉顶部标题栏的 -1000/-1500，
* 标题交给 HTML；简版用保留了标题栏的 -full，标题在图里，页面不再画一遍。
*
* 用 context 而不是 prop 传这个开关，是因为页面骨架在 app/page.tsx 里已定稿
* 不再改动，简版直接复用它整棵树，中间没有能插手传参的地方。
* 默认 false，完整版行为与现在完全一致。
*/
var HideDetailsContext = (0, import_react.createContext)(false);
function HideSceneDetails({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HideDetailsContext.Provider, {
		value: true,
		children
	});
}
function SceneExplorer() {
	const hideDetails = (0, import_react.useContext)(HideDetailsContext);
	const [filter, setFilter] = (0, import_react.useState)(groups[0].id);
	const [viewerIndex, setViewerIndex] = (0, import_react.useState)(null);
	const pendingScrollNo = (0, import_react.useRef)(null);
	const visible = (0, import_react.useMemo)(() => scenes.filter((scene) => scene.group === filter), [filter]);
	const handleIndexChange = (0, import_react.useCallback)((next) => {
		setViewerIndex(next);
		setFilter(scenes[next].group);
	}, []);
	const closeViewer = (0, import_react.useCallback)(() => {
		pendingScrollNo.current = viewerIndex === null ? null : scenes[viewerIndex].no;
		setViewerIndex(null);
	}, [viewerIndex]);
	(0, import_react.useEffect)(() => {
		if (viewerIndex !== null) return;
		const no = pendingScrollNo.current;
		if (no === null) return;
		pendingScrollNo.current = null;
		const card = document.getElementById(`scene-${no}`);
		if (!card) return;
		card.scrollIntoView({
			block: "start",
			behavior: "instant"
		});
		card.querySelector(".poster")?.focus({ preventScroll: true });
	}, [viewerIndex]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "explorer",
		id: "explorer",
		"aria-label": "20 个家庭看护场景",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "filter-bar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "chips",
					role: "group",
					"aria-label": "按家人筛选场景",
					children: filters.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": filter === item.id,
						className: filter === item.id ? "chip is-active" : "chip",
						onClick: () => setFilter(item.id),
						children: [item.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.sub })]
					}, item.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "result-count",
				"aria-live": "polite",
				children: [
					"共 ",
					visible.length,
					" 个场景"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: hideDetails ? "scene-list is-slim" : "scene-list",
				children: visible.map((scene) => {
					const globalIndex = scenes.indexOf(scene);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "scene-card",
						id: `scene-${scene.no}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "scene-head",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "scene-no",
									children: String(scene.no).padStart(2, "0")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `scene-tag tag-${scene.group}`,
									children: groupLabel[scene.group]
								})]
							}),
							!hideDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "scene-name",
								children: scene.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "scene-claim",
								children: scene.claim
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "poster",
								onClick: () => setViewerIndex(globalIndex),
								"aria-label": `放大查看${scene.name}对照海报`,
								children: [hideDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `/media/${scene.media}-full.webp`,
									alt: `${scene.name}对照画面：左侧${scene.problem.title}，右侧${scene.answer.title}`,
									width: 1920,
									height: 1080,
									loading: "lazy",
									decoding: "async"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `/media/${scene.media}-1000.webp`,
									srcSet: `/media/${scene.media}-1000.webp 1000w, /media/${scene.media}-1500.webp 1500w`,
									sizes: "(min-width: 620px) 500px, 100vw",
									alt: `${scene.name}对照画面：左侧${scene.problem.title}，右侧${scene.answer.title}`,
									width: 1e3,
									height: 442,
									loading: "lazy",
									decoding: "async"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "poster-zoom",
									"aria-hidden": "true",
									children: "点击放大"
								})]
							}),
							!hideDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "compare",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "compare-row is-problem",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "compare-label",
										children: "现在"
									}), scene.problem.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: scene.problem.detail })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "compare-row is-answer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "compare-label",
										children: "A100"
									}), scene.answer.title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: scene.answer.detail })]
								})]
							}), scene.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "scene-note",
								children: scene.note
							})] })
						]
					}, scene.no);
				})
			}),
			viewerIndex !== null && scenes[viewerIndex] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PosterViewer, {
				scenes,
				index: viewerIndex,
				onClose: closeViewer,
				onIndexChange: handleIndexChange
			})
		]
	});
}
//#endregion
export { HideSceneDetails, SceneExplorer };
