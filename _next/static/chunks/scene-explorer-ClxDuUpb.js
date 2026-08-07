import { r as __toESM } from "./rolldown-runtime-DFEGrk7x.js";
import { i as require_jsx_runtime, r as require_react } from "./framework-CZh43tRa.js";
import { n as groups, r as scenes, t as groupLabel } from "./scenes-B8_PTtUj.js";
//#region app/components/poster-viewer.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
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
		"aria-label": `${scenes.length} 个家庭看护场景`,
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
				style: { "--scene-total": `"${String(scenes.length).padStart(2, "0")}"` },
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
