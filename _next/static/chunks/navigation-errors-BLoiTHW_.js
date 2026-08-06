import { r as __toESM } from "./rolldown-runtime-DFEGrk7x.js";
import { r as require_react } from "./framework-CZh43tRa.js";
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/shims/navigation-context-state.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var LAYOUT_SEGMENT_CONTEXT_KEY = Symbol.for("vinext.layoutSegmentContext");
var SERVER_INSERTED_HTML_CONTEXT_KEY = Symbol.for("vinext.serverInsertedHTMLContext");
var BFCACHE_ID_MAP_CONTEXT_KEY = Symbol.for("vinext.bfcacheIdMapContext");
var BFCACHE_SEGMENT_ID_CONTEXT_KEY = Symbol.for("vinext.bfcacheSegmentIdContext");
var GLOBAL_HYDRATION_CONTEXT_KEY = Symbol.for("vinext.navigation.clientHydrationContext");
var NAVIGATION_FALLBACK_STATE_KEY = Symbol.for("vinext.navigation.fallback");
function createContextIfAvailable(defaultValue) {
	return typeof import_react.createContext === "function" ? import_react.createContext(defaultValue) : null;
}
function getServerInsertedHTMLContext() {
	const globalState = globalThis;
	if (!globalState[SERVER_INSERTED_HTML_CONTEXT_KEY]) globalState[SERVER_INSERTED_HTML_CONTEXT_KEY] = createContextIfAvailable(null);
	return globalState[SERVER_INSERTED_HTML_CONTEXT_KEY] ?? null;
}
var ServerInsertedHTMLContext = getServerInsertedHTMLContext();
function getLayoutSegmentContext() {
	const globalState = globalThis;
	if (!globalState[LAYOUT_SEGMENT_CONTEXT_KEY]) globalState[LAYOUT_SEGMENT_CONTEXT_KEY] = createContextIfAvailable({ children: [] });
	return globalState[LAYOUT_SEGMENT_CONTEXT_KEY] ?? null;
}
function getBfcacheIdMapContext() {
	const globalState = globalThis;
	if (!globalState[BFCACHE_ID_MAP_CONTEXT_KEY]) globalState[BFCACHE_ID_MAP_CONTEXT_KEY] = createContextIfAvailable(null);
	return globalState[BFCACHE_ID_MAP_CONTEXT_KEY] ?? null;
}
function getBfcacheSegmentIdContext() {
	const globalState = globalThis;
	if (!globalState[BFCACHE_SEGMENT_ID_CONTEXT_KEY]) globalState[BFCACHE_SEGMENT_ID_CONTEXT_KEY] = createContextIfAvailable(null);
	return globalState[BFCACHE_SEGMENT_ID_CONTEXT_KEY] ?? null;
}
var GLOBAL_ACCESSORS_KEY = Symbol.for("vinext.navigation.globalAccessors");
function getFallbackState() {
	const globalState = globalThis;
	return globalState[NAVIGATION_FALLBACK_STATE_KEY] ??= {
		serverContext: null,
		serverInsertedHTMLCallbacks: []
	};
}
function getGlobalAccessors() {
	return globalThis[GLOBAL_ACCESSORS_KEY];
}
function getClientHydrationContext() {
	const globalState = globalThis;
	if (Object.prototype.hasOwnProperty.call(globalState, GLOBAL_HYDRATION_CONTEXT_KEY)) return globalState[GLOBAL_HYDRATION_CONTEXT_KEY] ?? null;
}
function setClientHydrationContext(context) {
	globalThis[GLOBAL_HYDRATION_CONTEXT_KEY] = context;
}
function clearClientHydrationContext() {
	setClientHydrationContext(null);
}
var getServerContext = () => {
	{
		const hydrationContext = getClientHydrationContext();
		return hydrationContext !== void 0 ? hydrationContext : getFallbackState().serverContext;
	}
	return getGlobalAccessors()?.getServerContext() ?? getFallbackState().serverContext;
};
var setServerContext = (context) => {
	getFallbackState().serverContext = context;
	setClientHydrationContext(context);
};
var getInsertedHTMLCallbacks = () => getGlobalAccessors()?.getInsertedHTMLCallbacks() ?? getFallbackState().serverInsertedHTMLCallbacks;
var clearInsertedHTMLCallbacks = () => {
	const accessors = getGlobalAccessors();
	if (accessors) accessors.clearInsertedHTMLCallbacks();
	else getFallbackState().serverInsertedHTMLCallbacks = [];
};
/**
* Register request-scoped accessors supplied by navigation-state.ts.
* The global accessor key also bridges separate Vite module instances.
*/
function _registerStateAccessors(accessors) {
	getServerContext = accessors.getServerContext;
	setServerContext = accessors.setServerContext;
	getInsertedHTMLCallbacks = accessors.getInsertedHTMLCallbacks;
	clearInsertedHTMLCallbacks = accessors.clearInsertedHTMLCallbacks;
}
function getNavigationContext() {
	return getServerContext();
}
function setNavigationContext(context) {
	setServerContext(context);
}
function registerServerInsertedHTMLCallback(callback) {
	getInsertedHTMLCallbacks().push(callback);
}
function renderInsertedHTMLCallbacks(clear) {
	const callbacks = getInsertedHTMLCallbacks();
	const results = [];
	for (const callback of callbacks) try {
		const result = callback();
		if (result != null) results.push(result);
	} catch {}
	if (clear) callbacks.length = 0;
	return results;
}
function flushServerInsertedHTML() {
	return renderInsertedHTMLCallbacks(true);
}
function renderServerInsertedHTML() {
	return renderInsertedHTMLCallbacks(false);
}
function clearServerInsertedHTML() {
	clearInsertedHTMLCallbacks();
}
//#endregion
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/utils/redirect-digest.js
var NEXT_REDIRECT_PREFIX = "NEXT_REDIRECT;";
function parseRedirectDigest(digest) {
	if (!digest.startsWith(NEXT_REDIRECT_PREFIX)) return null;
	const firstSemi = digest.indexOf(";", 14);
	if (firstSemi === -1) return null;
	const rest = digest.slice(firstSemi + 1);
	const statusMatch = rest.match(/;(303|307|308);?$/);
	const isCanonical = rest !== "" && digest.endsWith(";");
	if (isCanonical && !statusMatch) return null;
	const target = statusMatch ? rest.slice(0, -statusMatch[0].length) : rest;
	let url = target;
	if (!isCanonical) try {
		url = decodeURIComponent(target);
	} catch {
		return null;
	}
	return {
		status: statusMatch ? Number(statusMatch[1]) : 307,
		type: digest.slice(14, firstSemi) || null,
		url
	};
}
//#endregion
//#region node_modules/.pnpm/vinext@1.0.0-beta.2_@vitejs+plugin-react@6.0.2_vite@8.0.13_@types+node@22.19.19_esbuild_e7be2e6b377207c7a31be0015992a8fd/node_modules/vinext/dist/shims/navigation-errors.js
/**
* Server-safe navigation control-flow errors and predicates.
*
* This module intentionally has no React or browser-runtime dependencies so
* RSC, SSR, and the public next/navigation shim can share one implementation.
*/
var HTTP_ERROR_FALLBACK_ERROR_CODE = "NEXT_HTTP_ERROR_FALLBACK";
function isHTTPAccessFallbackError(error) {
	if (!error || typeof error !== "object" || !("digest" in error)) return false;
	const digest = String(error.digest);
	return digest === "NEXT_NOT_FOUND" || digest.startsWith(`NEXT_HTTP_ERROR_FALLBACK;`);
}
function getAccessFallbackHTTPStatus(error) {
	if (error && typeof error === "object" && "digest" in error) {
		const digest = String(error.digest);
		if (digest === "NEXT_NOT_FOUND") return 404;
		if (digest.startsWith(`NEXT_HTTP_ERROR_FALLBACK;`)) return Number.parseInt(digest.split(";")[1], 10);
	}
	return 404;
}
var RedirectType = /* @__PURE__ */ function(RedirectType) {
	RedirectType["push"] = "push";
	RedirectType["replace"] = "replace";
	return RedirectType;
}({});
var VinextNavigationError = class extends Error {
	digest;
	constructor(message, digest) {
		super(message);
		this.digest = digest;
	}
};
/**
* The omitted redirect type is resolved by the catch site: push for Server
* Actions and replace for ordinary SSR/RSC rendering.
*/
function redirect(url, type) {
	throw new VinextNavigationError(`NEXT_REDIRECT:${url}`, `NEXT_REDIRECT;${type ?? ""};${encodeURIComponent(url)}`);
}
function permanentRedirect(url, type = "replace") {
	throw new VinextNavigationError(`NEXT_REDIRECT:${url}`, `NEXT_REDIRECT;${type};${encodeURIComponent(url)};308`);
}
function notFound() {
	throw new VinextNavigationError("NEXT_NOT_FOUND", `${HTTP_ERROR_FALLBACK_ERROR_CODE};404`);
}
function forbidden() {
	throw new VinextNavigationError("NEXT_FORBIDDEN", `${HTTP_ERROR_FALLBACK_ERROR_CODE};403`);
}
function unauthorized() {
	throw new VinextNavigationError("NEXT_UNAUTHORIZED", `${HTTP_ERROR_FALLBACK_ERROR_CODE};401`);
}
/**
* vinext accepts its three-part redirect digest and Next.js's five-part form.
* This is deliberately only a cheap prefix gate because vinext permits an
* empty redirect type; parseRedirectDigest is the authoritative validator.
*/
function isRedirectError(error) {
	return !!error && typeof error === "object" && "digest" in error && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT;");
}
function decodeRedirectError(digest) {
	const redirect = parseRedirectDigest(digest);
	if (!redirect) return null;
	return {
		url: redirect.url,
		type: redirect.type === "push" ? "push" : "replace"
	};
}
function isNextRouterError(error) {
	return isRedirectError(error) || isHTTPAccessFallbackError(error);
}
var BAILOUT_TO_CSR_DIGEST = "BAILOUT_TO_CLIENT_SIDE_RENDERING";
var BailoutToCSRError = class extends Error {
	digest = BAILOUT_TO_CSR_DIGEST;
	reason;
	constructor(reason) {
		super(`Bail out to client-side rendering: ${reason}`);
		this.reason = reason;
	}
};
function isBailoutToCSRError(error) {
	return !!error && typeof error === "object" && "digest" in error && error.digest === BAILOUT_TO_CSR_DIGEST;
}
var DYNAMIC_SERVER_USAGE_DIGEST = "DYNAMIC_SERVER_USAGE";
var DynamicServerError = class extends Error {
	digest = DYNAMIC_SERVER_USAGE_DIGEST;
	description;
	constructor(description) {
		super(`Dynamic server usage: ${description}`);
		this.description = description;
	}
};
function isDynamicServerError(error) {
	return !!error && typeof error === "object" && "digest" in error && error.digest === DYNAMIC_SERVER_USAGE_DIGEST;
}
/**
* Rethrow framework control-flow signals before user error handling consumes
* them. This covers the categories vinext can currently produce.
*/
function unstable_rethrow(error) {
	if (isNextRouterError(error) || isBailoutToCSRError(error) || isDynamicServerError(error)) throw error;
	if (error instanceof Error && "cause" in error) unstable_rethrow(error.cause);
}
//#endregion
export { setNavigationContext as A, flushServerInsertedHTML as C, getNavigationContext as D, getLayoutSegmentContext as E, registerServerInsertedHTMLCallback as O, clearServerInsertedHTML as S, getBfcacheSegmentIdContext as T, unstable_rethrow as _, decodeRedirectError as a, _registerStateAccessors as b, isBailoutToCSRError as c, isNextRouterError as d, isRedirectError as f, unauthorized as g, redirect as h, RedirectType as i, renderServerInsertedHTML as k, isDynamicServerError as l, permanentRedirect as m, DynamicServerError as n, forbidden as o, notFound as p, HTTP_ERROR_FALLBACK_ERROR_CODE as r, getAccessFallbackHTTPStatus as s, BailoutToCSRError as t, isHTTPAccessFallbackError as u, GLOBAL_ACCESSORS_KEY as v, getBfcacheIdMapContext as w, clearClientHydrationContext as x, ServerInsertedHTMLContext as y };
