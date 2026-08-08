const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_next/static/chunks/index-C61sK88d.js","_next/static/chunks/rolldown-runtime-DFEGrk7x.js","_next/static/chunks/framework-CZh43tRa.js","_next/static/chunks/app-elements-DCrmpow8.js","_next/static/chunks/hash-CJPcn2mk.js","_next/static/chunks/app-rsc-render-mode-D2LKp-63.js","_next/static/chunks/headers-CHh0EJRL.js","_next/static/chunks/protocol-headers-BAi6vrDC.js","_next/static/chunks/navigation-errors-BLoiTHW_.js"])))=>i.map(i=>d[i]);
import { r as __toESM } from "./rolldown-runtime-DFEGrk7x.js";
import "./app-elements-DCrmpow8.js";
import "./protocol-headers-BAi6vrDC.js";
import { i as require_jsx_runtime, r as require_react } from "./framework-CZh43tRa.js";
import { C as stripBasePath, E as registerNavigationRuntimeFunctions, S as hasBasePath, T as hasAppNavigationRuntime, _ as createRouteTrieCache, a as isAbsoluteOrProtocolRelativeUrl, b as isDangerousScheme, c as toSameOriginAppPath, g as getLocalePathPrefix, h as getDomainLocaleUrl, i as isBotUserAgent, l as withBasePath, m as detectDomainLocale, n as __vitePreload, o as normalizePathTrailingSlash, p as addLocalePrefix, r as scheduleAppPrefetchFetch, s as toBrowserNavigationHref, t as usePathname, v as matchRouteWithTrie, w as getNavigationRuntime, x as reportBlockedDangerousNavigation } from "./index-C61sK88d.js";
import { r as scenes } from "./scenes-Bg0oZ7x6.js";
import { r as urlQueryToSearchParams, t as appendSearchParamsToUrl } from "./query-DSZzhTKP.js";
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/shims/client-locale.js
function getCurrentBrowserLocale({ basePath, domainLocales, hostname }) {
	const pathnameLocale = getLocalePathPrefix(stripBasePath(window.location.pathname, basePath), window.__VINEXT_LOCALES__);
	if (pathnameLocale) return pathnameLocale;
	return detectDomainLocale(domainLocales, hostname ?? void 0)?.defaultLocale ?? window.__VINEXT_LOCALE__ ?? window.__VINEXT_DEFAULT_LOCALE__;
}
//#endregion
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/shims/internal/route-pattern-for-warning.js
function getCurrentRoutePathnameForWarning() {
	return window.location?.pathname ?? "/";
}
//#endregion
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/shims/link-prefetch.js
function canLinkPrefetch(input) {
	return input.nodeEnv === "production" && input.prefetch !== false && !input.isDangerous;
}
function canLinkIntentPrefetch(input) {
	if (input.nodeEnv !== "production" || input.isDangerous) return false;
	return input.routerMode === "pages" || input.prefetch !== false;
}
/**
* Normalize absolute and protocol-relative Link hrefs to app-relative paths
* that are eligible for prefetching. Non-absolute relative hrefs are returned
* unchanged; callers must resolve them against the current browser URL before
* constructing a concrete fetch target.
*/
function getLinkPrefetchHref(input) {
	const { href, basePath, currentOrigin } = input;
	if (!isAbsoluteOrProtocolRelativeUrl(href)) return href;
	if (currentOrigin === void 0) return null;
	try {
		const current = new URL(currentOrigin);
		const parsed = href.startsWith("//") ? new URL(href, current.origin) : new URL(href);
		if (parsed.origin !== current.origin) return null;
		if (!basePath) return parsed.pathname + parsed.search + parsed.hash;
		if (!hasBasePath(parsed.pathname, basePath)) return null;
		return stripBasePath(parsed.pathname, basePath) + parsed.search + parsed.hash;
	} catch {
		return null;
	}
}
//#endregion
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/shims/internal/link-status-registry.js
var linkSetterForMostRecentNavigation = null;
var currentNavigationIsLinkInitiated = false;
/**
* Mark `setter` as the link that started the most recent navigation, resetting
* the previously-tracked link's pending state to idle so only the last-clicked
* link shows a pending state.
*/
function setLinkForCurrentNavigation(setter) {
	if (linkSetterForMostRecentNavigation && linkSetterForMostRecentNavigation !== setter) linkSetterForMostRecentNavigation(false);
	linkSetterForMostRecentNavigation = setter;
	currentNavigationIsLinkInitiated = true;
}
/**
* Stop tracking `setter` if it is the current navigation link. Called when a
* <Link> finishes its own navigation or unmounts so we never hold a stale
* reference to an unmounted component's setter.
*/
function clearLinkForCurrentNavigation(setter) {
	if (linkSetterForMostRecentNavigation === setter) linkSetterForMostRecentNavigation = null;
}
/**
* Reset any link that is currently showing a pending state. Invoked at the
* start of every App Router navigation so that navigations not initiated by the
* tracked link — `router.push`/`router.replace`, form submissions, shallow
* routing, and browser back/forward — clear a stale pending indicator. A
* link-initiated navigation registers itself first via
* `setLinkForCurrentNavigation`; the matching call here consumes that marker and
* keeps the link pending.
*/
function notifyLinkNavigationStart() {
	if (currentNavigationIsLinkInitiated) {
		currentNavigationIsLinkInitiated = false;
		return;
	}
	if (linkSetterForMostRecentNavigation) {
		linkSetterForMostRecentNavigation(false);
		linkSetterForMostRecentNavigation = null;
	}
}
//#endregion
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/shims/link.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var LinkStatusContext = (0, import_react.createContext)({ pending: false });
var linkPrefetchNavigationEpoch = 0;
function notifyLinkNavigationStartAndCancelPrefetchSetup() {
	linkPrefetchNavigationEpoch += 1;
	notifyLinkNavigationStart();
}
registerNavigationRuntimeFunctions({ notifyLinkNavigationStart: notifyLinkNavigationStartAndCancelPrefetchSetup });
/** basePath from next.config.js, injected by the plugin at build time */
var __basePath = "";
/** trailingSlash from next.config.js, injected by the plugin at build time */
var __trailingSlash = false;
var linkPrefetchRouteTrieCache = createRouteTrieCache();
function resolveHref(href) {
	if (typeof href === "string") return href;
	let url = href.pathname ?? "";
	if (href.query) {
		const params = urlQueryToSearchParams(href.query);
		url = appendSearchParamsToUrl(url, params);
	}
	if (href.hash) url += href.hash.startsWith("#") ? href.hash : `#${href.hash}`;
	return url;
}
function resolvePagesQueryOnlyHref(href) {
	return href;
}
/**
* Collapse repeated forward-slashes (and convert backslashes to forward-slashes)
* in the path portion of a URL, preserving any query string.
*
* Ported from Next.js: packages/next/src/shared/lib/utils/normalize-repeated-slashes.ts
* https://github.com/vercel/next.js/blob/canary/packages/next/src/shared/lib/utils/normalize-repeated-slashes.ts
*/
function normalizeRepeatedSlashes(url) {
	const urlParts = url.split("?");
	const urlNoQueryString = urlParts.shift() ?? "";
	const queryString = urlParts.join("?");
	return urlNoQueryString.replace(/\\/g, "/").replace(/\/\/+/g, "/") + (queryString ? `?${queryString}` : "");
}
/**
* Emit Next.js's "Invalid href" `console.error` when `href` contains repeated
* forward slashes or backslashes in its path portion, and return the
* normalized URL (with `\\` converted to `/` and runs of `/` collapsed). If
* the href is already well-formed, the original string is returned unchanged.
*
* Ported from Next.js: packages/next/src/client/resolve-href.ts
* https://github.com/vercel/next.js/blob/canary/packages/next/src/client/resolve-href.ts
*
* Matches the message asserted by:
* test/e2e/repeated-forward-slashes-error/repeated-forward-slashes-error.test.ts
*
* Note: Next.js fires this warning unconditionally on every call to
* `resolveHref`. We mirror that behaviour (no dedup) for exact parity.
*
* Note: Next.js uses `router.pathname` (the route pattern, e.g.
* `/posts/[id]`) for the "in page" segment of the message. The Next.js
* compat test asserts this exact text (`in page: '/my/path/[name]'`), so we
* source it from the current render's route pattern via
* `getCurrentRoutePathnameForWarning()`: the Pages Router SSR context's route
* pattern on the server, `window.location.pathname` on the client, falling
* back to `"/"`.
*/
function warnAndNormalizeRepeatedSlashesInHref(urlAsString) {
	if (urlAsString.startsWith("//")) return urlAsString;
	const urlProtoMatch = urlAsString.match(/^[a-z][a-z0-9+.-]*:\/\//i);
	const urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
	if (!(urlAsStringNoProto.split("?", 1)[0] || "").match(/(\/\/|\\)/)) return urlAsString;
	const pathname = getCurrentRoutePathnameForWarning();
	console.error(`Invalid href '${urlAsString}' passed to next/router in page: '${pathname}'. Repeated forward-slashes (//) or backslashes \\ are not valid in the href.`);
	const normalizedNoProto = normalizeRepeatedSlashes(urlAsStringNoProto);
	return (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedNoProto;
}
function resolveLinkPrefetchMode(prefetchProp, isDangerous) {
	if (isDangerous || prefetchProp === false) return "disabled";
	if (prefetchProp === true) return "full";
	return "auto";
}
function toSameOriginRouteHref(href) {
	let url;
	try {
		url = new URL(href, window.location.href);
	} catch {
		return null;
	}
	if (url.origin !== window.location.origin) return null;
	return `${stripBasePath(url.pathname, __basePath)}${url.search}`;
}
function getLinkPrefetchRouterMode() {
	return hasAppNavigationRuntime() ? "app" : "pages";
}
function resolveMatchedAutoAppRoutePrefetch(route) {
	return {
		cacheForNavigation: !route.canPrefetchLoadingShell && route.requiresDynamicNavigationRequest !== true,
		prefetchShellFirst: !route.isDynamic,
		shouldPrefetch: true
	};
}
function resolveAutoAppRoutePrefetch(href) {
	const routes = window.__VINEXT_LINK_PREFETCH_ROUTES__;
	if (!routes) return {
		cacheForNavigation: false,
		prefetchShellFirst: false,
		shouldPrefetch: false
	};
	const routeHref = toSameOriginRouteHref(href);
	if (routeHref === null) return {
		cacheForNavigation: false,
		prefetchShellFirst: false,
		shouldPrefetch: false
	};
	const match = matchRouteWithTrie(routeHref, routes, linkPrefetchRouteTrieCache);
	if (!match) return {
		cacheForNavigation: false,
		prefetchShellFirst: false,
		shouldPrefetch: false
	};
	const prefetch = resolveMatchedAutoAppRoutePrefetch(match.route);
	if (new URL(routeHref, "http://vinext.local").search !== "") return {
		...prefetch,
		cacheForNavigation: false,
		prefetchShellFirst: true
	};
	return prefetch;
}
function resolveFullAppRoutePrefetch() {
	return {
		cacheForNavigation: true,
		prefetchShellFirst: true,
		shouldPrefetch: true
	};
}
/**
* Prefetch a URL for faster navigation.
*
* For App Router (RSC): fetches the .rsc payload in the background and
* stores it in an in-memory cache for instant use during navigation.
* For Pages Router: warms the page chunk, prefetches data only for SSG pages,
* and falls back to a document prefetch hint when no page loader matches.
*
* App Router and high-priority prefetches start immediately. Low-priority
* Pages Router fallback prefetches use `requestIdleCallback` (or `setTimeout`
* fallback) to avoid blocking the main thread during initial page load.
*/
function prefetchUrl(href, mode, priority = "low", pagesRouteHref, locale) {
	const navigationEpoch = linkPrefetchNavigationEpoch;
	const prefetchHref = getLinkPrefetchHref({
		href,
		basePath: __basePath,
		currentOrigin: window.location.origin
	});
	if (prefetchHref == null) return;
	const fullHref = toBrowserNavigationHref(prefetchHref, window.location.href, __basePath);
	toBrowserNavigationHref(pagesRouteHref === void 0 ? prefetchHref : getLinkPrefetchHref({
		href: pagesRouteHref,
		basePath: __basePath,
		currentOrigin: window.location.origin
	}) ?? prefetchHref, window.location.href, __basePath);
	const target = new URL(fullHref, window.location.href);
	if (target.origin === window.location.origin && target.pathname === window.location.pathname && target.search === window.location.search) return;
	const runPrefetch = () => {
		(async () => {
			if (hasAppNavigationRuntime()) {
				if (isBotUserAgent(window.navigator?.userAgent ?? "")) return;
				const [navigation, { AppElementsWire }, rscCacheBusting, { APP_RSC_RENDER_MODE_PREFETCH_DYNAMIC_SHELL, APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL }, headersModule, hybridRouteOwner] = await Promise.all([
					__vitePreload(() => import("./index-C61sK88d.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8])),
					__vitePreload(() => import("./app-elements-DCrmpow8.js").then((n) => n.t), __vite__mapDeps([3,1,2,4])),
					__vitePreload(() => import("./index-C61sK88d.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8])),
					__vitePreload(() => import("./app-rsc-render-mode-D2LKp-63.js").then((n) => n.t), __vite__mapDeps([5,1])),
					__vitePreload(() => import("./headers-CHh0EJRL.js").then((n) => n.h), __vite__mapDeps([6,1,7])),
					null
				]);
				if (navigationEpoch !== linkPrefetchNavigationEpoch) return;
				const { getPrefetchInterceptionContext, getPrefetchCache, getPrefetchedUrls, getMountedSlotsHeader, hasSearchAgnosticPrefetchShellForRoute, hasPrefetchCacheEntryForNavigation, peekPrefetchResponseForNavigation, prefetchRscResponse, restoreRscResponse, PREFETCH_CACHE_TTL } = navigation;
				const { createRscRequestHeaders, createRscRequestUrl } = rscCacheBusting;
				const { NEXT_ROUTER_PREFETCH_HEADER, NEXT_ROUTER_SEGMENT_PREFETCH_HEADER, VINEXT_MOUNTED_SLOTS_HEADER } = headersModule;
				const hybridOwner = null;
				if (hybridOwner === "pages" || hybridOwner === "document") return;
				const autoPrefetch = mode === "auto" ? resolveAutoAppRoutePrefetch(prefetchHref) : mode === "full-after-shell" ? {
					cacheForNavigation: true,
					prefetchShellFirst: true,
					shouldPrefetch: true
				} : resolveFullAppRoutePrefetch();
				if (!autoPrefetch.shouldPrefetch) return;
				const interceptionContext = getPrefetchInterceptionContext(fullHref);
				const mountedSlotsHeader = getMountedSlotsHeader();
				const isOptimisticRouteShellPrefetch = !autoPrefetch.cacheForNavigation;
				const hasSearchParams = new URL(fullHref, window.location.href).search !== "";
				const isAutomaticSearchParamShell = mode === "auto" && isOptimisticRouteShellPrefetch && hasSearchParams;
				if (isOptimisticRouteShellPrefetch && interceptionContext !== null) return;
				const hasSearchAgnosticShell = isAutomaticSearchParamShell && hasSearchAgnosticPrefetchShellForRoute(await createRscRequestUrl(fullHref, new Headers()), interceptionContext, mountedSlotsHeader);
				const headers = createRscRequestHeaders({
					interceptionContext,
					renderMode: isOptimisticRouteShellPrefetch ? hasSearchAgnosticShell ? APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL : isAutomaticSearchParamShell ? APP_RSC_RENDER_MODE_PREFETCH_DYNAMIC_SHELL : APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL : void 0
				});
				if (mountedSlotsHeader) headers.set(VINEXT_MOUNTED_SLOTS_HEADER, mountedSlotsHeader);
				if (isOptimisticRouteShellPrefetch || mode === "auto") {
					headers.set(NEXT_ROUTER_PREFETCH_HEADER, "1");
					headers.set(NEXT_ROUTER_SEGMENT_PREFETCH_HEADER, "1");
				}
				const rscUrl = await createRscRequestUrl(fullHref, headers);
				const additionalRscUrls = [];
				const cacheKey = AppElementsWire.encodeCacheKey(rscUrl, interceptionContext);
				const prefetched = getPrefetchedUrls();
				if (prefetched.has(cacheKey)) {
					if (!autoPrefetch.cacheForNavigation) return;
					const existing = getPrefetchCache().get(cacheKey);
					if (existing?.cacheForNavigation === false) existing.cacheForNavigation = true;
				}
				const fetchFullRscPayload = () => scheduleAppPrefetchFetch(() => fetch(rscUrl, {
					headers,
					credentials: "include",
					priority,
					purpose: "prefetch"
				}), priority);
				const fetchLoadingShellForReuse = async () => {
					const shellHeaders = createRscRequestHeaders({
						interceptionContext,
						renderMode: APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL
					});
					shellHeaders.set(NEXT_ROUTER_PREFETCH_HEADER, "1");
					shellHeaders.set(NEXT_ROUTER_SEGMENT_PREFETCH_HEADER, "1");
					if (mountedSlotsHeader) shellHeaders.set(VINEXT_MOUNTED_SLOTS_HEADER, mountedSlotsHeader);
					const shellRscUrl = await createRscRequestUrl(fullHref, shellHeaders);
					const shellCacheKey = AppElementsWire.encodeCacheKey(shellRscUrl, interceptionContext);
					const shellCache = getPrefetchCache();
					let shellEntry = shellCache.get(shellCacheKey);
					if (shellEntry === void 0) {
						getPrefetchedUrls().add(shellCacheKey);
						prefetchRscResponse(shellRscUrl, scheduleAppPrefetchFetch(() => fetch(shellRscUrl, {
							headers: shellHeaders,
							credentials: "include",
							priority,
							purpose: "prefetch"
						}), priority), interceptionContext, mountedSlotsHeader, void 0, {
							cacheForNavigation: false,
							optimisticRouteShell: true,
							prefetchKind: "loading-shell"
						});
						shellEntry = shellCache.get(shellCacheKey);
					}
					await shellEntry?.pending?.catch(() => {});
				};
				const fetchAliasCacheHitProbe = async () => {
					const probeHeaders = createRscRequestHeaders({
						interceptionContext,
						renderMode: APP_RSC_RENDER_MODE_PREFETCH_LOADING_SHELL
					});
					probeHeaders.set(NEXT_ROUTER_PREFETCH_HEADER, "1");
					probeHeaders.set(NEXT_ROUTER_SEGMENT_PREFETCH_HEADER, "1");
					if (mountedSlotsHeader) probeHeaders.set(VINEXT_MOUNTED_SLOTS_HEADER, mountedSlotsHeader);
					const probeRscUrl = await createRscRequestUrl(fullHref, probeHeaders);
					return fetch(probeRscUrl, {
						method: "HEAD",
						headers: probeHeaders,
						credentials: "include",
						priority,
						purpose: "prefetch"
					});
				};
				const hasExactNavigationCacheEntry = autoPrefetch.cacheForNavigation && hasPrefetchCacheEntryForNavigation(rscUrl, interceptionContext, mountedSlotsHeader);
				if (hasExactNavigationCacheEntry || autoPrefetch.cacheForNavigation && hasPrefetchCacheEntryForNavigation(rscUrl, interceptionContext, mountedSlotsHeader, { additionalRscUrls })) {
					if (!hasExactNavigationCacheEntry && !prefetched.has(cacheKey) && additionalRscUrls.length > 0 && autoPrefetch.prefetchShellFirst && mountedSlotsHeader === null) {
						prefetched.add(cacheKey);
						fetchAliasCacheHitProbe().then((response) => response.arrayBuffer()).catch(() => {});
					}
					return;
				}
				prefetched.add(cacheKey);
				const gateViaExplicitSearchShell = mode === "full" && hasSearchParams && autoPrefetch.prefetchShellFirst && mountedSlotsHeader === null;
				const gateViaLoadingShell = (mode === "full-after-shell" || gateViaExplicitSearchShell) && autoPrefetch.prefetchShellFirst;
				const fetchPromise = autoPrefetch.cacheForNavigation && gateViaLoadingShell ? (async () => {
					if (gateViaLoadingShell) {
						await fetchLoadingShellForReuse();
						return fetchFullRscPayload();
					}
					const shellHeaders = createRscRequestHeaders({
						interceptionContext,
						renderMode: void 0
					});
					shellHeaders.set(NEXT_ROUTER_PREFETCH_HEADER, "1");
					shellHeaders.set(NEXT_ROUTER_SEGMENT_PREFETCH_HEADER, "/_tree");
					if (mountedSlotsHeader) shellHeaders.set(VINEXT_MOUNTED_SLOTS_HEADER, mountedSlotsHeader);
					const shellRscUrl = await createRscRequestUrl(fullHref, shellHeaders);
					const shellCacheKey = AppElementsWire.encodeCacheKey(shellRscUrl, interceptionContext);
					const shellCache = getPrefetchCache();
					let shellEntry = shellCache.get(shellCacheKey);
					if (shellEntry === void 0) {
						getPrefetchedUrls().add(shellCacheKey);
						prefetchRscResponse(shellRscUrl, scheduleAppPrefetchFetch(() => fetch(shellRscUrl, {
							headers: shellHeaders,
							credentials: "include",
							priority,
							purpose: "prefetch"
						}), priority), interceptionContext, mountedSlotsHeader, void 0, {
							cacheForNavigation: false,
							optimisticRouteShell: false,
							prefetchKind: "route-tree"
						});
						shellEntry = shellCache.get(shellCacheKey);
					}
					await shellEntry?.pending?.catch(() => {});
					const renderedPathAndSearch = shellEntry?.snapshot?.renderedPathAndSearch;
					if (renderedPathAndSearch) {
						const cachedRenderedResponse = peekPrefetchResponseForNavigation(await createRscRequestUrl(renderedPathAndSearch, headers), interceptionContext, mountedSlotsHeader);
						if (cachedRenderedResponse) return restoreRscResponse(cachedRenderedResponse);
					}
					return scheduleAppPrefetchFetch(() => fetch(rscUrl, {
						headers,
						credentials: "include",
						priority,
						purpose: "prefetch"
					}), priority);
				})() : fetchFullRscPayload();
				if (mode === "full" && autoPrefetch.cacheForNavigation && autoPrefetch.prefetchShellFirst && mountedSlotsHeader === null && !gateViaExplicitSearchShell) fetchLoadingShellForReuse();
				prefetchRscResponse(rscUrl, fetchPromise, interceptionContext, mountedSlotsHeader, void 0, {
					cacheForNavigation: autoPrefetch.cacheForNavigation,
					fallbackTtlMs: PREFETCH_CACHE_TTL,
					optimisticRouteShell: isOptimisticRouteShellPrefetch,
					prefetchKind: isOptimisticRouteShellPrefetch ? "loading-shell" : "navigation",
					searchAgnosticShell: isAutomaticSearchParamShell && !hasSearchAgnosticShell
				});
			}
		})().catch((error) => {
			console.error("[vinext] RSC prefetch setup error:", error);
		});
	};
	if (priority === "high" || hasAppNavigationRuntime()) {
		runPrefetch();
		return;
	}
	(window.requestIdleCallback ?? ((fn) => setTimeout(fn, 100)))(runPrefetch);
}
async function promotePrefetchEntriesForNavigation(href) {
	if (!hasAppNavigationRuntime()) return;
	const [{ getPrefetchCache }, { stripRscCacheBustingSearchParam, stripRscSuffix }] = await Promise.all([__vitePreload(() => import("./index-C61sK88d.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8])), __vitePreload(() => import("./index-C61sK88d.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8]))]);
	let target;
	try {
		target = new URL(toBrowserNavigationHref(href, window.location.href, __basePath), window.location.href);
	} catch {
		return;
	}
	for (const [cacheKey, entry] of getPrefetchCache()) {
		if (entry.optimisticRouteShell === true) continue;
		if (entry.prefetchKind === "route-tree") continue;
		const [rscUrl] = cacheKey.split("\0", 1);
		let cached;
		try {
			cached = new URL(rscUrl, window.location.href);
		} catch {
			continue;
		}
		stripRscCacheBustingSearchParam(cached);
		if (stripRscSuffix(cached.pathname) === target.pathname && cached.search === target.search) entry.cacheForNavigation = true;
	}
}
/**
* Shared IntersectionObserver for viewport-based prefetching.
* All Link elements use the same observer to minimize resource usage.
*/
var sharedObserver = null;
var observedLinkPrefetches = /* @__PURE__ */ new WeakMap();
var visibleLinkPrefetches = /* @__PURE__ */ new Set();
var visibleAppPrefetchQueue = [];
var visibleAppPrefetchDrainScheduled = false;
function drainVisibleAppPrefetchQueue() {
	visibleAppPrefetchDrainScheduled = false;
	while (true) {
		const instance = visibleAppPrefetchQueue.pop();
		if (!instance) return;
		instance.queuedViewportPrefetch = false;
		if (!instance.isVisible || instance.routerMode !== "app") continue;
		prefetchUrl(instance.href, instance.mode, "low", instance.pagesRouteHref);
	}
}
function scheduleVisibleAppPrefetch(instance) {
	if (instance.queuedViewportPrefetch) return;
	instance.queuedViewportPrefetch = true;
	visibleAppPrefetchQueue.push(instance);
	if (visibleAppPrefetchDrainScheduled) return;
	visibleAppPrefetchDrainScheduled = true;
	queueMicrotask(drainVisibleAppPrefetchQueue);
}
function setVisibleLinkPrefetch(instance, isVisible) {
	instance.isVisible = isVisible;
	if (isVisible) {
		visibleLinkPrefetches.add(instance);
		if (instance.routerMode === "pages" && instance.viewportPrefetched) return;
		if (instance.routerMode === "app") scheduleVisibleAppPrefetch(instance);
		else prefetchUrl(instance.href, instance.mode, "low", instance.pagesRouteHref, instance.locale);
		instance.viewportPrefetched = true;
	} else visibleLinkPrefetches.delete(instance);
}
function registerVisibleLinkPing() {
	registerNavigationRuntimeFunctions({ pingVisibleLinks: pingVisibleLinkPrefetches });
}
function pingVisibleLinkPrefetches() {
	for (const instance of visibleLinkPrefetches) if (instance.isVisible && instance.routerMode === "app") scheduleVisibleAppPrefetch(instance);
}
function getSharedObserver() {
	if (typeof IntersectionObserver === "undefined") return null;
	if (sharedObserver) return sharedObserver;
	sharedObserver = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			const instance = observedLinkPrefetches.get(entry.target);
			if (!instance) continue;
			setVisibleLinkPrefetch(instance, entry.isIntersecting || entry.intersectionRatio > 0);
		}
	}, { rootMargin: "250px" });
	return sharedObserver;
}
function getDefaultLocale() {
	return window.__VINEXT_DEFAULT_LOCALE__;
}
function getCurrentLocale() {
	return getCurrentBrowserLocale({
		basePath: __basePath,
		domainLocales: getDomainLocales(),
		hostname: getCurrentHostname()
	});
}
function getDomainLocales() {
	return window.__NEXT_DATA__?.domainLocales;
}
function getCurrentHostname() {
	return window.location.hostname;
}
function getDomainLocaleHref(href, locale) {
	return getDomainLocaleUrl(href, locale, {
		basePath: __basePath,
		currentHostname: getCurrentHostname(),
		domainItems: getDomainLocales()
	});
}
function addLocalePrefixForRoot(href, locale) {
	if (href !== "/" && !href.startsWith("/?") && !href.startsWith("/#")) return;
	let parsed;
	try {
		parsed = new URL(href, "http://vinext.local");
	} catch {
		return;
	}
	if (parsed.origin !== "http://vinext.local" || parsed.pathname !== "/") return;
	return `/${locale}${parsed.search}${parsed.hash}`;
}
/**
* Apply locale prefix to a URL path based on the locale prop.
* - locale="fr" → prepend /fr (unless it already has a locale prefix)
* - locale={false} → use the href as-is (no locale prefix, link to default)
* - locale=undefined → use current locale (href as-is in most cases)
*/
function applyLocaleToHref(href, locale) {
	if (locale === false) return href;
	const resolvedLocale = locale ?? getCurrentLocale();
	if (resolvedLocale === void 0) return href;
	if (isAbsoluteOrProtocolRelativeUrl(href)) return href;
	const domainLocaleHref = getDomainLocaleHref(href, resolvedLocale);
	if (domainLocaleHref) return domainLocaleHref;
	const defaultLocale = getDefaultLocale() ?? "";
	if (resolvedLocale.toLowerCase() === defaultLocale.toLowerCase()) {
		const localeRootHref = addLocalePrefixForRoot(href, resolvedLocale);
		if (localeRootHref) return localeRootHref;
	}
	return addLocalePrefix(href, resolvedLocale, defaultLocale);
}
var Link = (0, import_react.forwardRef)(function Link({ href, as, replace = false, prefetch: prefetchProp, scroll = true, shallow = false, children: childrenProp, onClick, onMouseEnter, onTouchStart, onNavigate, unstable_dynamicOnHover = false, legacyBehavior = false, passHref = false, transitionTypes: _transitionTypes, ...rest }, forwardedRef) {
	const asHref = as === void 0 ? void 0 : resolveHref(as);
	const { locale, ...restWithoutLocale } = rest;
	let children = childrenProp;
	if (legacyBehavior && (typeof childrenProp === "string" || typeof childrenProp === "number")) children = import_react.createElement("a", null, childrenProp);
	const unresolvedHref = asHref ?? resolveHref(href);
	const rawResolvedHref = typeof unresolvedHref === "string" && unresolvedHref.startsWith("#") ? resolvePagesQueryOnlyHref(unresolvedHref) : unresolvedHref;
	typeof href === "string" || resolveHref(href);
	const resolvedHref = typeof rawResolvedHref === "string" ? warnAndNormalizeRepeatedSlashesInHref(rawResolvedHref) : rawResolvedHref;
	const isDangerous = typeof resolvedHref === "string" && isDangerousScheme(resolvedHref);
	const normalizedHref = normalizePathTrailingSlash(applyLocaleToHref(isDangerous ? "/" : resolvedHref, locale), __trailingSlash);
	const normalizedRouteHref = normalizedHref;
	const fullHref = normalizePathTrailingSlash(withBasePath(normalizedHref, __basePath), __trailingSlash);
	const [pending, setPending] = (0, import_react.useState)(false);
	const mountedRef = (0, import_react.useRef)(true);
	const setPendingRef = (0, import_react.useRef)(null);
	if (setPendingRef.current === null) setPendingRef.current = (next) => {
		if (mountedRef.current) setPending(next);
	};
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		const setter = setPendingRef.current;
		return () => {
			mountedRef.current = false;
			if (setter) clearLinkForCurrentNavigation(setter);
		};
	}, []);
	const internalRef = (0, import_react.useRef)(null);
	const prefetchMode = resolveLinkPrefetchMode(prefetchProp, isDangerous);
	const shouldViewportPrefetch = canLinkPrefetch({
		nodeEnv: "production",
		prefetch: prefetchProp,
		isDangerous
	});
	const setRefs = (0, import_react.useCallback)((node) => {
		internalRef.current = node;
		if (typeof forwardedRef === "function") forwardedRef(node);
		else if (forwardedRef) forwardedRef.current = node;
	}, [forwardedRef]);
	(0, import_react.useEffect)(() => {
		if (!shouldViewportPrefetch || false) return;
		const node = internalRef.current;
		if (!node) return;
		const hrefToPrefetch = getLinkPrefetchHref({
			href: normalizedHref,
			basePath: __basePath,
			currentOrigin: window.location.origin
		});
		if (hrefToPrefetch == null) return;
		const observer = getSharedObserver();
		if (!observer) return;
		registerVisibleLinkPing();
		const instance = {
			href: hrefToPrefetch,
			isVisible: false,
			locale,
			mode: prefetchMode,
			pagesRouteHref: normalizedRouteHref === normalizedHref ? void 0 : getLinkPrefetchHref({
				href: normalizedRouteHref,
				basePath: __basePath,
				currentOrigin: window.location.origin
			}) ?? void 0,
			queuedViewportPrefetch: false,
			routerMode: getLinkPrefetchRouterMode(),
			viewportPrefetched: false
		};
		observedLinkPrefetches.set(node, instance);
		observer.observe(node);
		return () => {
			observer.unobserve(node);
			observedLinkPrefetches.delete(node);
			visibleLinkPrefetches.delete(instance);
			instance.isVisible = false;
		};
	}, [
		shouldViewportPrefetch,
		prefetchMode,
		normalizedHref,
		normalizedRouteHref,
		locale
	]);
	const prefetchOnIntent = (0, import_react.useCallback)(() => {
		if (!canLinkIntentPrefetch({
			nodeEnv: "production",
			prefetch: prefetchProp,
			isDangerous,
			routerMode: getLinkPrefetchRouterMode()
		})) return;
		const intentMode = unstable_dynamicOnHover ? "full-after-shell" : prefetchMode;
		if (unstable_dynamicOnHover && internalRef.current) {
			const instance = observedLinkPrefetches.get(internalRef.current);
			if (instance) instance.mode = "full-after-shell";
			promotePrefetchEntriesForNavigation(normalizedHref);
		}
		prefetchUrl(normalizedHref, intentMode, "high", normalizedRouteHref === normalizedHref ? void 0 : normalizedRouteHref, locale);
	}, [
		prefetchProp,
		isDangerous,
		prefetchMode,
		normalizedHref,
		normalizedRouteHref,
		locale,
		unstable_dynamicOnHover
	]);
	const handleMouseEnter = (0, import_react.useCallback)((e) => {
		onMouseEnter?.(e);
		prefetchOnIntent();
	}, [onMouseEnter, prefetchOnIntent]);
	const handleTouchStart = (0, import_react.useCallback)((e) => {
		onTouchStart?.(e);
		prefetchOnIntent();
	}, [onTouchStart, prefetchOnIntent]);
	const handleClick = async (e, options = {}) => {
		if (!options.skipLinkOnClick && onClick) onClick(e);
		if (e.defaultPrevented) return;
		if (e.currentTarget.hasAttribute("download")) return;
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		if (e.currentTarget.target && e.currentTarget.target !== "_self") return;
		let navigateHref = normalizedHref;
		if (isAbsoluteOrProtocolRelativeUrl(resolvedHref)) {
			const localPath = toSameOriginAppPath(resolvedHref, __basePath);
			if (localPath == null) {
				if (replace) {
					e.preventDefault();
					window.location.replace(resolvedHref);
				}
				return;
			}
			navigateHref = localPath;
		}
		e.preventDefault();
		const hasAppNavigationRuntime = Boolean(getNavigationRuntime()?.functions.navigate);
		const absoluteFullHref = toBrowserNavigationHref(hasAppNavigationRuntime ? navigateHref : navigateHref, window.location.href, __basePath);
		if (onNavigate) try {
			const navUrl = new URL(absoluteFullHref, window.location.origin);
			let prevented = false;
			const navEvent = {
				url: navUrl,
				preventDefault() {
					prevented = true;
				},
				get defaultPrevented() {
					return prevented;
				}
			};
			onNavigate(navEvent);
			if (navEvent.defaultPrevented) return;
		} catch {}
		if (hasAppNavigationRuntime) {
			const { navigateClientSide } = await __vitePreload(async () => {
				const { navigateClientSide } = await import("./index-C61sK88d.js");
				return { navigateClientSide };
			}, __vite__mapDeps([0,1,2,3,4,5,6,7,8]));
			const setter = setPendingRef.current;
			if (setter) setLinkForCurrentNavigation(setter);
			setPending(true);
			import_react.startTransition(() => {
				navigateClientSide(navigateHref, replace ? "replace" : "push", scroll, true).finally(() => {
					if (mountedRef.current) setPending(false);
					if (setter) clearLinkForCurrentNavigation(setter);
				});
			});
			return;
		} else if (replace) window.location.replace(absoluteFullHref);
		else window.location.assign(absoluteFullHref);
	};
	const anchorProps = restWithoutLocale;
	const linkStatusValue = import_react.useMemo(() => ({ pending }), [pending]);
	if (isDangerous) {
		const handleDangerousClick = (event) => {
			if (onClick) onClick(event);
			reportBlockedDangerousNavigation();
		};
		if (legacyBehavior) {
			const child = import_react.Children.only(children);
			const childOnClick = child.props.onClick;
			const childRef = child.props.ref;
			const setDangerousRefs = (node) => {
				internalRef.current = node;
				if (typeof childRef === "function") childRef(node);
				else if (childRef) childRef.current = node;
			};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkStatusContext.Provider, {
				value: linkStatusValue,
				children: import_react.cloneElement(child, {
					ref: setDangerousRefs,
					onClick: (event) => {
						if (childOnClick) childOnClick(event);
						reportBlockedDangerousNavigation();
					}
				})
			});
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkStatusContext.Provider, {
			value: linkStatusValue,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				ref: setRefs,
				onClick: handleDangerousClick,
				onMouseEnter: handleMouseEnter,
				onTouchStart: handleTouchStart,
				...anchorProps,
				children
			})
		});
	}
	if (legacyBehavior) {
		const child = import_react.Children.only(children);
		const childPropsExisting = child.props;
		const childHasOwnHref = child.type === "a" ? "href" in childPropsExisting : false;
		const shouldForwardHref = passHref || child.type === "a" && !childHasOwnHref;
		const childOnClick = childPropsExisting.onClick;
		const childOnMouseEnter = childPropsExisting.onMouseEnter;
		const childOnTouchStart = childPropsExisting.onTouchStart;
		const childRef = childPropsExisting.ref;
		const setLegacyRefs = (node) => {
			internalRef.current = node;
			if (typeof childRef === "function") childRef(node);
			else if (childRef) childRef.current = node;
		};
		const clonedProps = {
			ref: setLegacyRefs,
			onClick: (event) => {
				if (childOnClick) childOnClick(event);
				if (event.defaultPrevented) return;
				return handleClick(event, { skipLinkOnClick: true });
			},
			onMouseEnter: (event) => {
				if (childOnMouseEnter) childOnMouseEnter(event);
				prefetchOnIntent();
			},
			onTouchStart: (event) => {
				if (childOnTouchStart) childOnTouchStart(event);
				prefetchOnIntent();
			}
		};
		if (shouldForwardHref) clonedProps.href = fullHref;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkStatusContext.Provider, {
			value: linkStatusValue,
			children: import_react.cloneElement(child, clonedProps)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkStatusContext.Provider, {
		value: linkStatusValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			ref: setRefs,
			href: fullHref,
			onClick: handleClick,
			onMouseEnter: handleMouseEnter,
			onTouchStart: handleTouchStart,
			...anchorProps,
			children
		})
	});
});
//#endregion
//#region app/components/version-switch.tsx
/**
* 页尾导航：投票入口 + 完整版 / 简版互跳。
*
* 挂在 layout 而不是各自页面里：完整版 app/page.tsx 已定稿不再改动，
* 这是在不碰它的前提下给它加上入口的唯一位置。简版 /gallery 直接复用那棵树，
* 所以两个路由一次都拿到。
*
* 投票入口没有并进下面那行互跳小字里：那一行是「同一份内容的两种看法」之间的
* 切换，投票是另一件事（要填名字、要一路划完），混在一起会让人以为是第三个版本。
* 所以做成一块独立的按钮，放在互跳小字上面。
*/
function VersionSwitch() {
	const pathname = usePathname();
	if (pathname === "/vote") return null;
	const isSlim = pathname === "/gallery";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "vote-entry",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			href: "/vote",
			className: "vote-entry-btn",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "先做哪几个场景？来投一票" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [scenes.length, " 张卡一路滑完，约 2 分钟"] })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "version-switch-foot",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			href: isSlim ? "/" : "/gallery",
			children: isSlim ? "完整版 · 带场景说明" : "简版 · 场景只看图"
		})
	})] });
}
//#endregion
export { VersionSwitch };
