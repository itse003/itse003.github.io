import { n as __exportAll } from "./rolldown-runtime-DFEGrk7x.js";
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/server/app-rsc-render-mode.js
var app_rsc_render_mode_exports = /* @__PURE__ */ __exportAll({
	APP_RSC_RENDER_MODE_NAVIGATION: () => APP_RSC_RENDER_MODE_NAVIGATION,
	APP_RSC_RENDER_MODE_PREFETCH_DYNAMIC_SHELL: () => APP_RSC_RENDER_MODE_PREFETCH_DYNAMIC_SHELL,
	APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL: () => APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL,
	getRscRenderModeCacheVariant: () => getRscRenderModeCacheVariant,
	parseAppRscRenderMode: () => parseAppRscRenderMode
});
var APP_RSC_RENDER_MODE_NAVIGATION = "navigation";
var APP_RSC_RENDER_MODE_PREFETCH_DYNAMIC_SHELL = "prefetch-dynamic-shell";
var APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL = "prefetch-loading-shell";
function getRscRenderModeCacheVariant(mode) {
	if (mode === "prefetch-dynamic-shell") return "prefetch-dynamic-shell";
	if (mode === "prefetch-loading-shell") return "prefetch-loading-shell";
	return null;
}
function parseAppRscRenderMode(value) {
	switch (value) {
		case APP_RSC_RENDER_MODE_PREFETCH_DYNAMIC_SHELL: return APP_RSC_RENDER_MODE_PREFETCH_DYNAMIC_SHELL;
		case APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL: return APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL;
		default: return APP_RSC_RENDER_MODE_NAVIGATION;
	}
}
//#endregion
export { parseAppRscRenderMode as n, app_rsc_render_mode_exports as t };
